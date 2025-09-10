import React from "react";
import { HeartPulse } from "lucide-react";

export default function LoadingOverlay({ show, label = "Loading..." }: { show: boolean; label?: string }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-background/80 px-6 py-5 shadow-2xl">
        <HeartPulse className="h-8 w-8 text-primary animate-pulse-soft" />
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
