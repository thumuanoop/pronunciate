import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, GraduationCap, HeartPulse, Search, Volume2 } from "lucide-react";
import AudioVisualizer from "@/components/app/AudioVisualizer";
import LoadingOverlay from "@/components/app/LoadingOverlay";
import TermCard, { Term } from "@/components/app/TermCard";
import { useSpeech } from "@/hooks/use-speech";

const TERMS: Term[] = [
  { name: "Prophylactic", phonetic: "/ˌproʊfɪˈlæktɪk/", category: "basic" },
  { name: "Lesions", phonetic: "/ˈliʒənz/", category: "basic" },
  { name: "Exaggerated", phonetic: "/ɪɡˈzædʒəˌreɪtɪd/", category: "basic" },
  { name: "Eukaryotic", phonetic: "/juˌkæriˈɑtɪk/", category: "advanced" },
  { name: "Prokaryotic", phonetic: "/ˌproʊkæriˈɑtɪk/", category: "advanced" },
  { name: "Self-luminous", phonetic: "/sɛlf ˈluməˌnʌs/", category: "basic" },
  { name: "Plotted", phonetic: "/ˈplɑtəd/", category: "basic" },
  { name: "Microaerophilic", phonetic: "/ˌmaɪkroʊˌɛroʊˈfɪlɪk/", category: "advanced" },
  { name: "Capnophilic", phonetic: "/kæpˈnoʊfɪlɪk/", category: "advanced" },
  { name: "Mesophiles", phonetic: "/ˈmɛsoʊˌfaɪlz/", category: "advanced" },
  { name: "Psychrophiles", phonetic: "/ˈsaɪkroʊˌfaɪlz/", category: "advanced" },
  { name: "Inspissation", phonetic: "/ˌɪnspɪˈseɪʃən/", category: "advanced" },
  { name: "Tyndallisation", phonetic: "/ˈtɪndəlaɪˌzeɪʃən/", category: "advanced" },
  { name: "Germinate", phonetic: "/ˈdʒɜrməˌneɪt/", category: "basic" },
  { name: "Ketogenesis", phonetic: "/ˌkitoʊˈdʒɛnəsɪs/", category: "advanced" },
  { name: "Hyperbilirubinemia", phonetic: "/ˌhaɪpərˌbɪlɪruˌbɪˈnimiə/", category: "advanced" },
  { name: "Apolipoproteins", phonetic: "/ˌæpoʊˌlaɪpoʊˈproʊtiɪnz/", category: "advanced" },
  { name: "Centrifugation", phonetic: "/ˌsɛntrɪˌfjuɡəˈteɪʃən/", category: "basic" },
  { name: "Reagent blank", phonetic: "/riˈeɪdʒənt blæŋk/", category: "basic" },
  { name: "Calibration", phonetic: "/ˌkæləˈbreɪʃən/", category: "basic" },
  { name: "Nephelometry", phonetic: "/nɛˌfələˈmɛtri/", category: "advanced" },
  { name: "Spectrophotometer", phonetic: "/ˌspɛktroʊfoʊˈtɑməˌtər/", category: "advanced" },
  { name: "Hypercholesterolemia", phonetic: "/ˌhaɪpərkoʊˌlɛstərəˈlimiə/", category: "advanced" },
  { name: "Ubiquinone", phonetic: "/juˈbɪkwɪˌnoʊn/", category: "advanced" },
  { name: "Pyramidines", phonetic: "/pəˈrɪməˌdins/", category: "advanced" },
  { name: "Denaturation", phonetic: "/diˌneɪtʃəˈreɪʃən/", category: "advanced" },
  { name: "Sphingomyelin", phonetic: "/ˌsfɪŋɡoʊˈmaɪəlɪn/", category: "advanced" },
  { name: "Tryptophan", phonetic: "/ˈtrɪptoʊˌfæn/", category: "basic" },
  { name: "Phenylalanine", phonetic: "/ˌfɛnəlˈæləˌnin/", category: "basic" },
  { name: "Hypertrophy", phonetic: "/haɪˈpɜrtroʊfi/", category: "basic" },
  { name: "Hyperplasia", phonetic: "/ˌhaɪpərˈpleɪʒə/", category: "basic" },
  { name: "Gangrene", phonetic: "/ˈɡæŋɡrin/", category: "basic" },
  { name: "Chemotaxis", phonetic: "/ˌkimoʊˈtæksɪs/", category: "advanced" },
  { name: "Lymphadenopathy", phonetic: "/lɪmˌfædəˈnɑpəθi/", category: "advanced" },
  { name: "Phagocytosis", phonetic: "/ˌfæɡoʊsaɪˈtoʊsɪs/", category: "advanced" },
  { name: "Hemoglobinopathies", phonetic: "/ˌhimoʊˌɡloʊbɪˈnɑpəθiz/", category: "advanced" },
  { name: "Spherocytosis", phonetic: "/ˌsfɪroʊsaɪˈtoʊsɪs/", category: "advanced" },
  { name: "Thalassemia", phonetic: "/ˌθæləˈsimiə/", category: "advanced" },
  { name: "Hematocrit", phonetic: "/hɪˈmætəˌkrɪt/", category: "basic" },
  { name: "Arteriosclerosis", phonetic: "/ɑrˌtɪrioʊskləˈroʊsɪs/", category: "advanced" },
  { name: "Cardiomyopathy", phonetic: "/ˌkɑrdioʊmaɪˈɑpəθi/", category: "advanced" },
  { name: "Cirrhosis", phonetic: "/sɪˈroʊsɪs/", category: "basic" },
  { name: "Adenocarcinoma", phonetic: "/ˌædənoʊˌkɑrsəˈnoʊmə/", category: "advanced" },
  { name: "Papilloma", phonetic: "/ˌpæpəˈloʊmə/", category: "basic" },
];

export default function Index() {
  const [tab, setTab] = useState("search");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ term: string; phonetic: string } | null>(null);
  const [filter, setFilter] = useState<"all" | "basic" | "advanced">("all");
  const [learned, setLearned] = useState<Set<string>>(new Set());

  const { speak, speaking, googleVoice, defaultEn } = useSpeech();

  const filteredTerms = useMemo(() => {
    const list = filter === "all" ? TERMS : TERMS.filter((t) => t.category === filter);
    return list;
  }, [filter]);

  useEffect(() => {
    // Prefill result if query exists and matches a known term
    if (!query) return;
    const match = TERMS.find((t) => t.name.toLowerCase() === query.toLowerCase());
    if (match) setResult({ term: match.name, phonetic: match.phonetic });
    else setResult({ term: query, phonetic: `/${query.toLowerCase().replace(/[^a-z]/g, "")}/` });
  }, [query]);

  function onPlay(text: string) {
    speak(text, { voice: googleVoice ?? defaultEn, rate: 0.85, pitch: 1, volume: 0.95 });
    setLearned((prev) => new Set(prev).add(text.toLowerCase()));
  }

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    // Simulate minimal delay to show UX feedback
    await new Promise((r) => setTimeout(r, 350));
    const match = TERMS.find((t) => t.name.toLowerCase() === query.toLowerCase());
    if (match) setResult({ term: match.name, phonetic: match.phonetic });
    else setResult({ term: query, phonetic: `/${query.toLowerCase().replace(/[^a-z]/g, "")}/` });
    setLoading(false);
  }

  const learnedPct = Math.round((learned.size / TERMS.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-indigo-50 to-fuchsia-100">
      <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
                AURA PRONOUNCE
              </h1>
              <p className="text-xs text-muted-foreground">&nbsp;</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border bg-white/60 px-3 py-2 shadow-sm">
              <GraduationCap className="h-4 w-4 text-sky-600" />
              <div>
                <p className="text-xs font-semibold leading-tight">∞ Terms</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Curated set</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border bg-white/60 px-3 py-2 shadow-sm">
              <Volume2 className="h-4 w-4 text-indigo-600" />
              <div>
                <p className="text-xs font-semibold leading-tight">100% Audio</p>
                <p className="text-[10px] text-muted-foreground leading-tight">Pronunciation ready</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <div className="flex items-center justify-center">
            <TabsList className="bg-white/60 backdrop-blur shadow-sm">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="learn">Learn</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="search" className="mt-8">
            <section className="mx-auto max-w-3xl">
              <div className="flex items-center justify-center gap-3 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Search Medical Terms</h2>
                  <p className="text-sm text-muted-foreground">Get pronunciation and phonetic transcription</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur md:flex-row">
                <div className="relative w-full">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Enter a medical term (e.g., Prophylactic, Lesions...)"
                    className="h-12 w-full rounded-xl pl-9"
                    aria-label="Search medical term"
                  />
                </div>
                <Button onClick={handleSearch} className="h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-md">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>


              {result && (
                <div className="mt-6 rounded-2xl border bg-white/70 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-sky-700 flex items-center gap-2">
                      <HeartPulse className="h-5 w-5 text-sky-500" /> {result.term}
                    </h3>
                    <Badge variant="secondary" className="rounded-full">Pronunciation</Badge>
                  </div>
                  <p className="mt-2 font-mono text-base italic text-indigo-700">{result.phonetic}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <Button onClick={() => onPlay(result.term)} className="rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow">
                      <Volume2 className="mr-2 h-4 w-4" /> Play
                    </Button>
                    <p className="text-xs text-muted-foreground">Click to hear pronunciation</p>
                  </div>
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="learn" className="mt-8">
            <section>
              <div className="flex items-center justify-center gap-3 text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Learn Medical Terms</h2>
                  <p className="text-sm text-muted-foreground">Practice pronunciation of essential terminology</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {["all", "basic", "advanced"].map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "outline"}
                    onClick={() => setFilter(f as any)}
                    className={`rounded-full ${filter === f ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white" : ""}`}
                  >
                    {f === "all" ? "All Terms" : f.charAt(0).toUpperCase() + f.slice(1)}
                  </Button>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTerms.map((t) => (
                  <TermCard key={t.name} term={t} onPlay={(term) => onPlay(term.name)} />
                ))}
              </div>

              <div className="mt-10 rounded-2xl border bg-white/70 p-6 backdrop-blur">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-sky-700">
                  <HeartPulse className="h-4 w-4" /> Learning Progress
                </h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>Terms learned</span>
                      <span className="font-semibold text-sky-700">{learnedPct}%</span>
                    </div>
                    <Progress value={learnedPct} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>Pronunciation accuracy</span>
                      <span className="font-semibold text-sky-700">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>

      <AudioVisualizer active={speaking} />
      <LoadingOverlay show={loading} label="Loading pronunciation..." />
    </div>
  );
}
