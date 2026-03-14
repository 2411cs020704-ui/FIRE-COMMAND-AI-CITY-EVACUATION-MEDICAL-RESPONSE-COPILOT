import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl, PerspectiveCamera as PerspectiveCameraImpl } from '@react-three/drei';
import { Physics, useBox, useHeightfield } from '@react-three/cannon';
import * as THREE from 'three';
import type { Mesh } from 'three';

interface Building {
  name: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  color: string;
}

interface Incident {
  id: number;
  locationX: number;
  locationY: number;
  locationZ: number;
  type: string;
  severity: string;
}

interface EvacuationRoute {
  path: Array<{ x: number; y: number }>;
  severity?: string;
}

// Define MRUH campus buildings with positions matching the synthetic hill curve from pathfinding.ts
const CAMPUS_BUILDINGS: Building[] = [
  { name: 'Engineering Block', x: -50, y: 0, z: -50, width: 60, height: 40, depth: 50, color: '#4a5568' }, // Bottom of hill
  { name: 'Science Block', x: 200, y: 0, z: 200, width: 50, height: 35, depth: 45, color: '#2d3748' },    // Top of hill
  { name: 'Library', x: 50, y: 0, z: 80, width: 40, height: 30, depth: 40, color: '#1a202c' },
  { name: 'Hostel A', x: -80, y: 0, z: 50, width: 45, height: 25, depth: 40, color: '#4a5568' },
  { name: 'Medical Center', x: 120, y: 0, z: 80, width: 35, height: 20, depth: 35, color: '#742a2a' }, // On slope
  { name: 'Admin Block', x: 0, y: 0, z: -80, width: 50, height: 25, depth: 40, color: '#3d3d3d' },
];

// Physics-enabled Building component
function PhysicsBuilding({ building, terrainHeightAtBase }: { building: Building, terrainHeightAtBase: number }) {
  // Building is static (mass = 0)
  const [ref] = useBox<THREE.Mesh>(() => ({
    type: 'Static',
    mass: 0,
    args: [building.width, building.height, building.depth],
    position: [building.x, terrainHeightAtBase + building.height / 2, building.z]
  }));

  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[building.width, building.height, building.depth]} />
      <meshStandardMaterial
        color={building.color}
        emissive={hovered ? '#ff0000' : '#000000'}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}

// Physics-Enabled Heightfield Terrain
function PhysicsTerrain() {
  const gridSize = 10;
  const cellSize = 50;

  // Generate heightfield data mapping pathfinding.ts logical elevation
  const heights = useMemo(() => {
    const data: number[][] = [];
    for (let x = 0; x < gridSize; x++) {
      const row: number[] = [];
      for (let y = 0; y < gridSize; y++) {
        const elevation = ((x + y) / (gridSize * 2 - 2)) * 40;
        row.push(elevation);
      }
      data.push(row);
    }
    return data;
  }, []);

  const [ref] = useHeightfield<THREE.Mesh>(() => ({
    args: [heights, { elementSize: cellSize }],
    position: [-250, 0, 250], // Center offset for 500x500 grid
    rotation: [-Math.PI / 2, 0, 0] // Cannon.js expects heightfield laid flat
  }));

  const geometry = useMemo(() => {
    const size = (gridSize - 1) * cellSize;
    // +1 because heightfield points are one larger than grid cells
    const geom = new THREE.PlaneGeometry(size, size, gridSize - 1, gridSize - 1);
    geom.rotateX(-Math.PI / 2);

    const positions = geom.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const xIndex = Math.floor(i / 3) % gridSize;
      const zIndex = Math.floor(Math.floor(i / 3) / gridSize);

      // Mirror the height fetching
      if (heights[xIndex] && heights[xIndex][gridSize - 1 - zIndex] !== undefined) {
        positions[i + 1] = heights[xIndex][gridSize - 1 - zIndex];
      }
    }
    geom.computeVertexNormals();
    return geom;
  }, [heights]);

  return (
    <mesh receiveShadow position={[-250, 0, -250]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#2d4c1e" wireframe={false} />
    </mesh>
  );
}


function FireEffect({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const smokeRef = useRef<THREE.Points>(null);
  const fireCount = 800;
  const smokeCount = 400;

  const fireParticles = useMemo(() => {
    const positions = new Float32Array(fireCount * 3);
    const colors = new Float32Array(fireCount * 3);
    const sizes = new Float32Array(fireCount);

    const colorOptions = [
      new THREE.Color('#ffcc00'),
      new THREE.Color('#ff6600'),
      new THREE.Color('#cc0000')
    ];

    for (let i = 0; i < fireCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
      sizes[i] = Math.random() * 3 + 1;

      const c = colorOptions[Math.floor(Math.random() * colorOptions.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors, sizes };
  }, [fireCount]);

  const smokeParticles = useMemo(() => {
    const positions = new Float32Array(smokeCount * 3);
    const sizes = new Float32Array(smokeCount);
    for (let i = 0; i < smokeCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = 15 + Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
      sizes[i] = Math.random() * 5 + 3;
    }
    return { positions, sizes };
  }, [smokeCount]);

  // Implement Wind Gravity effect on the fire particles
  useFrame((state) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < fireCount; i++) {
        positions[i * 3 + 1] += 0.2 + Math.random() * 0.2;

        // Wind influence pushing particles to the +X direction
        positions[i * 3] += 0.15 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;

        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 2 + i) * 0.1;

        if (positions[i * 3 + 1] > 25) {
          positions[i * 3 + 1] = 0;
          positions[i * 3] = (Math.random() - 0.5) * 15;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (smokeRef.current) {
      const positions = smokeRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < smokeCount; i++) {
        positions[i * 3 + 1] += 0.1 + Math.random() * 0.1;

        // Heavy wind spread for smoke
        positions[i * 3] += 0.3 + Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.15;

        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.5 + i) * 0.15;

        if (positions[i * 3 + 1] > 45) {
          positions[i * 3 + 1] = 15;
          positions[i * 3] = (Math.random() - 0.5) * 15;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
      }
      smokeRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fireParticles.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[fireParticles.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={1.5} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <points ref={smokeRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[smokeParticles.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={4} color="#333333" transparent opacity={0.4} depthWrite={false} />
      </points>
    </group>
  );
}

function IncidentMarker({ incident, elevation }: { incident: Incident, elevation: number }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.02;
      meshRef.current.scale.z = 1 + Math.sin(Date.now() / 500) * 0.2;
    }
  });

  const color = incident.severity === 'critical' ? '#ff0000' : incident.severity === 'warning' ? '#ff9900' : '#ffff00';

  return (
    <mesh ref={meshRef} position={[incident.locationX, elevation + 15, incident.locationY]}>
      <sphereGeometry args={[8, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} wireframe={true} />
    </mesh>
  );
}

function PhysicsEvacuationPath({ route, index }: { route: EvacuationRoute; index: number }) {
  const lineRef = useRef<any>(null);

  useEffect(() => {
    if (lineRef.current && route.path && route.path.length > 0) {
      // Offset Y based on elevation logic mapped from pathfinder calculations 
      const points = route.path.map(p => {
        const gridXRatio = Math.max(0, Math.min(1, (p.x + 250) / 500));
        const gridZRatio = Math.max(0, Math.min(1, (p.y + 250) / 500));
        const elevation = (gridXRatio + gridZRatio) * 20;
        return new THREE.Vector3(p.x, elevation + 5, p.y);
      });
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineRef.current.geometry = geometry;
    }
  }, [route]);

  // Different colors for multiple routes (SDG 11)
  const colors = ["#ff003c", "#0dccf2", "#00ffaa", "#ff9900"];
  const color = colors[index % colors.length];

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color={color} linewidth={6} transparent opacity={0.8} />
    </line>
  );
}

function PhysicsHeatmapGrid({ zones }: { zones: Array<{ x: number; y: number; severity: string }> }) {
  return (
    <>
      {zones.map((zone, idx) => {
        // Adjust Y pos roughly based on slope
        const gridXRatio = Math.max(0, Math.min(1, (zone.x + 250) / 500));
        const gridZRatio = Math.max(0, Math.min(1, (zone.y + 250) / 500));
        const elevation = (gridXRatio + gridZRatio) * 20;

        const color = zone.severity === 'critical' ? '#ff0000' : zone.severity === 'warning' ? '#ff9900' : '#00ff00';
        return (
          <mesh key={idx} position={[zone.x, elevation + 1, zone.y]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color={color} transparent={true} opacity={0.3} emissive={color} emissiveIntensity={0.4} />
          </mesh>
        );
      })}
    </>
  );
}


function CampusScene({
  incidents,
  evacuationRoutes,
  zones,
}: {
  incidents: Incident[];
  evacuationRoutes: EvacuationRoute[];
  zones: Array<{ x: number; y: number; severity: string }>;
}) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(250, 200, 250);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[200, 300, 200]} castShadow intensity={1.5} shadow-mapSize={[2048, 2048]} />
      <pointLight position={[0, 100, 0]} intensity={0.5} />

      {/* Real Physics Terrain matching the A* Navigation Mesh */}
      <PhysicsTerrain />

      {/* Campus buildings pinned onto the Terrain slope */}
      {CAMPUS_BUILDINGS.map((building) => {
        // Determine synthetic base terrain height for the building's coordinates
        const gridXRatio = Math.max(0, Math.min(1, (building.x + 250) / 500));
        const gridZRatio = Math.max(0, Math.min(1, (building.z + 250) / 500));
        const elevation = (gridXRatio + gridZRatio) * 20;
        return <PhysicsBuilding key={building.name} building={building} terrainHeightAtBase={elevation} />;
      })}

      <PhysicsHeatmapGrid zones={zones} />

      {incidents.map((incident) => {
        const gridXRatio = Math.max(0, Math.min(1, (incident.locationX + 250) / 500));
        const gridZRatio = Math.max(0, Math.min(1, (incident.locationY + 250) / 500));
        const elevation = (gridXRatio + gridZRatio) * 20;

        return (
          <React.Fragment key={incident.id}>
            <IncidentMarker incident={incident} elevation={elevation} />
            {incident.type === 'fire' && <FireEffect position={[incident.locationX, elevation, incident.locationY]} />}
          </React.Fragment>
        );
      })}

      {evacuationRoutes.map((route, idx) => (
        <PhysicsEvacuationPath key={idx} route={route} index={idx} />
      ))}

      <OrbitControlsImpl enableZoom={true} enablePan={true} enableRotate={true} autoRotate={false} maxPolarAngle={Math.PI / 2.2} />
    </Physics>
  );
}

interface Campus3DProps {
  incidents: Incident[];
  evacuationRoutes?: EvacuationRoute[];
  zones?: Array<{ x: number; y: number; severity: string }>;
}

export function Campus3D({
  incidents,
  evacuationRoutes = [],
  zones = [],
}: Campus3DProps) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '600px' }}>
      <Canvas shadows>
        <PerspectiveCameraImpl makeDefault position={[250, 200, 250]} fov={60} />
        <CampusScene incidents={incidents} evacuationRoutes={evacuationRoutes} zones={zones} />
      </Canvas>
    </div>
  );
}

export default Campus3D;
