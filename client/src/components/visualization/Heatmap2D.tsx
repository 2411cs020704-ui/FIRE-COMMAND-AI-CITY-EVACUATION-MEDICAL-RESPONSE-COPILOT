import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";

// Initialize Mapbox with API Key
// We provide a fallback token for demo purposes if env is missing
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

interface PhysicsZone {
  id: string;
  coordinates: [number, number]; // [lng, lat]
  severity: number;              // 0.0 to 1.0
  physicsFactors: {
    elevation: number;
    slope: number;
    wind: number;
    water: number;
    terrain: number;
  };
}

interface Heatmap2DProps {
  className?: string;
  initialCenter?: [number, number];
  initialZoom?: number;
  zones?: PhysicsZone[];
}

export function Heatmap2D({
  className,
  initialCenter = [78.4744, 17.3753], // Assuming generic Hyderabad/MRUH coords
  initialZoom = 16,
  zones = [],
}: Heatmap2DProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize Mapbox
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: initialCenter,
      zoom: initialZoom,
      pitch: 45, // Angled slightly to show 3D buildings if available
    });

    map.current.on("load", () => {
      // Add 3D buildings layer if available in Mapbox
      const layers = map.current?.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;

      map.current?.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );

      // Initialize an empty GeoJSON source for our Physics Heatmap zones
      map.current?.addSource("physics-zones", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // Add the heatmap layer mapping the abstract 'severity' value to a color gradient
      map.current?.addLayer({
        id: "physics-heatmap-layer",
        type: "heatmap",
        source: "physics-zones",
        maxzoom: 24,
        paint: {
          // Increase weight based on severity
          "heatmap-weight": ["interpolate", ["linear"], ["get", "severity"], 0, 0, 1, 1],
          
          // Heatmap transition colors: Blue -> Cyan -> Green -> Yellow -> Red
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0, "rgba(0, 0, 255, 0)",
            0.2, "royalblue",
            0.4, "cyan",
            0.6, "lime",
            0.8, "yellow",
            1, "red"
          ],
          // Radius based on zoom level to keep logical size
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 10, 15, 20, 60],
          // Opacity lowers as you zoom in tightly to see ground details
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 14, 0.8, 20, 0.3],
        },
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [initialCenter, initialZoom]);

  // Update GeoJSON source dynamically when zones change due to Physics calculations
  useEffect(() => {
    if (!map.current || !map.current.getSource("physics-zones")) return;

    const source = map.current.getSource("physics-zones") as mapboxgl.GeoJSONSource;
    
    source.setData({
      type: "FeatureCollection",
      features: zones.map((zone) => ({
        type: "Feature",
        properties: {
          severity: zone.severity,
          ...zone.physicsFactors, 
        },
        geometry: {
          type: "Point",
          coordinates: zone.coordinates,
        },
      })),
    });
  }, [zones]);

  return <div ref={mapContainer} className={cn("w-full h-full min-h-[500px] rounded-lg overflow-hidden", className)} />;
}
