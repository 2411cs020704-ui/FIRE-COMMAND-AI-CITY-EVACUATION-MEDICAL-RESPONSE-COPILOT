import { getCampusZones, getActiveIncidents } from "../db";

export interface RetrievedKnowledge {
  nearbyZones: Array<{ id: number; name: string; x: number; y: number; distance: number }>;
  activeIncidents: any[];
}

/**
 * Knowledge Retriever (RAG implementation simplified)
 * Gathers context from the database based on the incident location
 */
export async function retrieveKnowledge(incident: { locationX: number; locationY: number }): Promise<RetrievedKnowledge> {
  const zones = await getCampusZones();
  const incidents = await getActiveIncidents();

  // Find nearby zones ordered by distance
  const nearbyZones = zones
    .map((zone) => {
      const distance = Math.sqrt(
        Math.pow(zone.zoneX - incident.locationX, 2) + Math.pow(zone.zoneY - incident.locationY, 2)
      );
      return {
        id: zone.id,
        name: zone.name,
        x: zone.zoneX,
        y: zone.zoneY,
        distance,
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10); // Top 10 relevant zones

  return {
    nearbyZones,
    activeIncidents: incidents,
  };
}
