import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function HowItWorks() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black">How FireCommand Works</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/")}>Home</Button>
            <Button onClick={() => setLocation("/command-center")}>Command Center</Button>
          </div>
        </div>

        <Card className="p-5 bg-white/5 border-white/10">
          <h2 className="text-lg font-bold mb-2">Multi-Agent Flow</h2>
          <p className="text-sm text-slate-300">SensorFusion → SpreadPredictor → EvacuationPlanner → VulnerabilityTriage → ResourceAllocator → BroadcastAgent → HealthMonitor.</p>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-5 bg-white/5 border-[#0dccf2]/30">
            <h3 className="font-bold mb-2">SDG 11</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>Detects fire instantly</li>
              <li>Calculates 4 evacuation routes</li>
              <li>Allocates ambulances and resources</li>
              <li>Broadcasts alerts to 700 people</li>
            </ul>
          </Card>
          <Card className="p-5 bg-white/5 border-[#0dccf2]/30">
            <h3 className="font-bold mb-2">SDG 13</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>Analyzes wind direction North</li>
              <li>Predicts spread South</li>
              <li>Identifies 15-minute evacuation window</li>
              <li>Simulates gravity, terrain, and wind</li>
            </ul>
          </Card>
          <Card className="p-5 bg-white/5 border-[#0dccf2]/30">
            <h3 className="font-bold mb-2">SDG 03</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>Identifies 33 vulnerable people</li>
              <li>Plans accessible low-slope routes</li>
              <li>Deploys ambulances and medical staff</li>
              <li>Monitors vital signs during evacuation</li>
            </ul>
          </Card>
        </div>

        <Card className="p-6 bg-[#0dccf2]/10 border-[#0dccf2]/40">
          <h3 className="text-xl font-black text-[#0dccf2]">Demo Result</h3>
          <p className="text-slate-200 mt-2">700 people evacuated in 7 minutes, zero casualties, all vulnerable people prioritized, medical support ready.</p>
          <a
            href="https://healthai-production-d6ad.up.railway.app"
            target="_blank"
            rel="noreferrer"
            className="inline-flex mt-4 items-center rounded-md border border-[#0dccf2]/40 px-3 py-2 text-sm font-semibold text-[#0dccf2] hover:bg-[#0dccf2]/10"
          >
            Open Health Portal
          </a>
        </Card>
      </div>
    </div>
  );
}
