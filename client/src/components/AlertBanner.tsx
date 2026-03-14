import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { useSocket } from "@/contexts/SocketContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";

export function AlertBanner() {
  const { data: activeIncidents } = trpc.emergency.getActiveIncidents.useQuery();
  
  const criticalIncidents = activeIncidents?.filter(i => i.severity === 'critical') || [];

  if (criticalIncidents.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2 px-4 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3 overflow-hidden">
        <AlertTriangle className="flex-shrink-0" size={20} />
        <div className="flex gap-4 animate-marquee whitespace-nowrap">
          {criticalIncidents.map((incident, idx) => (
            <span key={incident.id} className="font-bold">
              CRITICAL {incident.type.toUpperCase()} AT {(incident.buildingName || "UNKNOWN").toUpperCase()}
              {idx < criticalIncidents.length - 1 && " | "}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-xs font-bold bg-white text-red-600 px-2 py-0.5 rounded">
          {criticalIncidents.length} ACTIVE
        </span>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
