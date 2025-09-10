import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type VoiceChoice = SpeechSynthesisVoice | null;

export function useSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices
  useEffect(() => {
    function loadVoices() {
      const list = window.speechSynthesis?.getVoices?.() || [];
      setVoices(list);
    }
    loadVoices();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const pickVoice = useCallback(
    (preferred: (v: SpeechSynthesisVoice) => boolean): VoiceChoice => {
      if (!voices.length) return null;
      const found = voices.find(preferred);
      if (found) return found;
      const en = voices.find((v) => v.lang?.toLowerCase().startsWith("en"));
      return en ?? voices[0] ?? null;
    },
    [voices],
  );

  const speak = useCallback(
    (text: string, opts?: { rate?: number; pitch?: number; volume?: number; voice?: VoiceChoice }) => {
      if (!("speechSynthesis" in window)) return;
      if (!text) return;
      // Cancel any ongoing
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = opts?.rate ?? 0.9;
      u.pitch = opts?.pitch ?? 1;
      u.volume = opts?.volume ?? 1;
      if (opts?.voice) u.voice = opts.voice;
      setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      currentUtterance.current = u;
      window.speechSynthesis.speak(u);
    },
    [],
  );

  const cancel = useCallback(() => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    currentUtterance.current = null;
  }, []);

  const googleVoice = useMemo(() => pickVoice((v) => /google/i.test(v.name) && /en/i.test(v.lang)), [pickVoice]);
  const defaultEn = useMemo(() => pickVoice((v) => /en-US/i.test(v.lang)), [pickVoice]);

  return { voices, speak, cancel, speaking, googleVoice, defaultEn };
}
