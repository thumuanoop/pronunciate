import React from "react";
import { Volume2 } from "lucide-react";

export type Term = { name: string; phonetic: string; category: "basic" | "advanced" };

export default function TermCard({ term, onPlay }: { term: Term; onPlay: (t: Term) => void }) {
  return (
    <button
      type="button"
      onClick={() => onPlay(term)}
      className="group relative flex w-full flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow hover:shadow-xl hover:-translate-y-0.5 transition-all backdrop-blur-lg"
    >
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-foreground">{term.name}</h4>
        <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs text-primary">
          {term.category}
        </span>
      </div>
      <p className="font-mono text-sm text-primary/90 italic">{term.phonetic}</p>
      <div className="mt-2 flex items-center gap-2 text-muted-foreground">
        <span className="text-xs">Tap to hear</span>
        <Volume2 className="h-4 w-4 text-primary transition-transform group-hover:scale-110" />
      </div>
    </button>
  );
}
