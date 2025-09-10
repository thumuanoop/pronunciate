import React from "react";

export default function AudioVisualizer({ active }: { active: boolean }) {
  return (
    <div
      className={
        "fixed bottom-6 right-6 z-40 rounded-full border border-white/10 bg-background/70 backdrop-blur px-4 py-3 shadow-lg transition-opacity " +
        (active ? "opacity-100" : "opacity-0 pointer-events-none")
      }
      aria-hidden={!active}
    >
      <div className="flex items-end gap-1 h-6" aria-label="Audio visualization">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={`w-1 rounded-sm bg-primary animate-bar ${i % 2 ? "animation-delay-100" : ""}`}
            style={{ animationDelay: `${(i % 5) * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
