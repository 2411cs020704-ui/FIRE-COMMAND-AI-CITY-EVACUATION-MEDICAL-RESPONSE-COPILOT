import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (onNewIncident?: (incident: any) => void, onIncidentResolved?: (incidentId: string) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Determine the socket URL based on the environment
    const socketUrl = window.location.origin;
    
    const socket = io(socketUrl, {
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    if (onNewIncident) {
      socket.on("new_incident", onNewIncident);
    }

    if (onIncidentResolved) {
      socket.on("incident_resolved", onIncidentResolved);
    }

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
    });

    return () => {
      socket.disconnect();
    };
  }, [onNewIncident, onIncidentResolved]);

  return socketRef.current;
};
