import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, HeartPulse, Wind, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black tracking-tight">
            MRUH <span className="text-[#0dccf2]">FORTRESS</span>
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/how-it-works")}>
              How It Works
            </Button>
            <Button onClick={() => setLocation("/command-center")}>
              Open Command Center
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 space-y-10">
        <section className="space-y-4">
          <p className="text-[#0dccf2] font-bold uppercase tracking-[0.2em] text-xs">AI Campus Disaster Command System</p>
          <h2 className="text-4xl md:text-5xl font-black leading-tight">
            FireCommand evacuates 700 people in 7 minutes with zero casualties
          </h2>
          <p className="text-slate-300 max-w-3xl">
            FireCommand is a multi-agent emergency operating system that detects incidents, predicts climate-driven spread,
            plans evacuation with physics-aware routing, prioritizes vulnerable people, and coordinates real-time medical response.
          </p>
          <div className="flex gap-3 pt-2">
            <Button size="lg" onClick={() => setLocation("/command-center")}>
              Launch Live Simulation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation("/how-it-works")}>
              View SDG Alignment
            </Button>
            <a
              href="https://healthai-production-d6ad.up.railway.app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-md border border-white/20 px-4 py-2 text-sm font-medium hover:border-[#0dccf2] hover:text-[#0dccf2]"
            >
              Health Portal
            </a>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          <Card className="p-5 bg-white/5 border-[#0dccf2]/30">
            <div className="flex items-center gap-2 text-[#0dccf2] mb-2">
              <ShieldCheck className="h-4 w-4" />
              <h3 className="font-bold">SDG 11</h3>
            </div>
            <p className="text-sm text-slate-300">Instant fire detection, 4 evacuation routes, smart resource allocation, and broadcast to 700 people.</p>
          </Card>
          <Card className="p-5 bg-white/5 border-[#0dccf2]/30">
            <div className="flex items-center gap-2 text-[#0dccf2] mb-2">
              <Wind className="h-4 w-4" />
              <h3 className="font-bold">SDG 13</h3>
            </div>
            <p className="text-sm text-slate-300">North wind analysis, South spread prediction, 15-minute evacuation window, terrain and gravity simulation.</p>
          </Card>
          <Card className="p-5 bg-white/5 border-[#0dccf2]/30">
            <div className="flex items-center gap-2 text-[#0dccf2] mb-2">
              <HeartPulse className="h-4 w-4" />
              <h3 className="font-bold">SDG 03</h3>
            </div>
            <p className="text-sm text-slate-300">33 vulnerable citizens tracked, accessible routing, ambulance dispatch, and live triage monitoring.</p>
          </Card>
        </section>

        <section className="grid md:grid-cols-4 gap-4">
          <Card className="p-4 bg-[#0dccf2]/10 border-[#0dccf2]/40">
            <p className="text-xs text-slate-400">Evacuated</p>
            <p className="text-3xl font-black text-[#0dccf2]">700</p>
          </Card>
          <Card className="p-4 bg-[#0dccf2]/10 border-[#0dccf2]/40">
            <p className="text-xs text-slate-400">Time</p>
            <p className="text-3xl font-black text-[#0dccf2]">7 min</p>
          </Card>
          <Card className="p-4 bg-[#0dccf2]/10 border-[#0dccf2]/40">
            <p className="text-xs text-slate-400">Casualties</p>
            <p className="text-3xl font-black text-[#0dccf2]">0</p>
          </Card>
          <Card className="p-4 bg-[#0dccf2]/10 border-[#0dccf2]/40">
            <p className="text-xs text-slate-400">Vulnerable Prioritized</p>
            <p className="text-3xl font-black text-[#0dccf2]">33/33</p>
          </Card>
        </section>
      </main>
    </div>
  );
}
