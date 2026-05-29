"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Leaf,
  Stethoscope,
  MessageCircle,
  Upload,
  X,
  Send,
  Loader2,
  Sun,
  Droplets,
  Sprout,
  AlertTriangle,
  CheckCircle2,
  Camera,
  ShieldCheck,
  Bot,
  History,
  Plus,
} from "lucide-react";
import { useUser } from "@/src/context/user.provider";
import { useCreatePlant, useSaveScan } from "@/src/hooks/garden";
import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import {
  identifyPlant,
  diagnoseDisease,
  chat as chatApi,
  type IdentifyResult,
  type DiagnoseResult,
  type ChatMessage,
} from "@/src/services/AiService";
import { toast } from "sonner";

type Tab = "identify" | "diagnose" | "chat";

function ImageDrop({
  preview,
  onPick,
  onClear,
  label,
}: {
  preview: string | null;
  onPick: (file: File) => void;
  onClear: () => void;
  label: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onPick(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden group ${
        dragOver
          ? "border-green-500 bg-green-50 dark:bg-green-900/20 scale-[1.01]"
          : "border-gray-300 dark:border-gray-600 hover:border-green-400 bg-gray-50 dark:bg-gray-800/50"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
        }}
      />
      {preview ? (
        <div className="relative aspect-[4/3] w-full">
          <img src={preview} alt="upload preview" className="w-full h-full object-cover" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
            <Camera className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">{label}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag &amp; drop or click to upload · PNG / JPG up to ~10 MB
          </p>
        </div>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ConfidenceBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const tone =
    v >= 85
      ? "from-green-500 to-emerald-500"
      : v >= 70
        ? "from-amber-400 to-orange-500"
        : "from-rose-400 to-red-500";
  return (
    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${tone} transition-all duration-700`}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function severityTone(severity: string) {
  const s = severity.toLowerCase();
  if (s.includes("serious")) return "text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-300";
  if (s.includes("moderate")) return "text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-300";
  return "text-green-700 bg-green-50 dark:bg-green-900/30 dark:text-green-300";
}

export default function AiGardenPage() {
  const [tab, setTab] = useState<Tab>("identify");
  const { user } = useUser();
  const { mutate: saveScan } = useSaveScan();
  const { mutate: createPlant, isPending: addingPlant } = useCreatePlant();
  const [savedPlantId, setSavedPlantId] = useState<string | null>(null);

  // identify
  const [idImage, setIdImage] = useState<{ file: File; preview: string; base64: string } | null>(null);
  const [idImageUrl, setIdImageUrl] = useState<string | null>(null);
  const [hint, setHint] = useState("");
  const [idResult, setIdResult] = useState<IdentifyResult | null>(null);
  const [idLoading, setIdLoading] = useState(false);

  // diagnose
  const [dxImage, setDxImage] = useState<{ file: File; preview: string; base64: string } | null>(null);
  const [dxImageUrl, setDxImageUrl] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [dxResult, setDxResult] = useState<DiagnoseResult | null>(null);
  const [dxLoading, setDxLoading] = useState(false);

  // chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm your garden assistant. Ask me about watering, light, soil, pests, or a specific plant — keep me honest, I'll keep it practical.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const handlePickFor = useCallback(
    async (file: File, kind: "identify" | "diagnose") => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image is too large. Keep it under 10 MB.");
        return;
      }
      const base64 = await fileToBase64(file);
      const preview = URL.createObjectURL(file);
      if (kind === "identify") {
        setIdImage({ file, preview, base64 });
        setIdResult(null);
        setIdImageUrl(null);
        setSavedPlantId(null);
      } else {
        setDxImage({ file, preview, base64 });
        setDxResult(null);
        setDxImageUrl(null);
      }
    },
    [],
  );

  const runIdentify = async () => {
    if (!idImage && !hint.trim()) {
      toast.error("Add a photo or a description first.");
      return;
    }
    setIdLoading(true);
    setIdResult(null);
    setSavedPlantId(null);
    try {
      const r = await identifyPlant({ imageBase64: idImage?.base64, hint });
      setIdResult(r);
      // Save the scan to history for logged-in users. Upload the image
      // to Cloudinary first so the history page can show a thumbnail.
      if (user?.email) {
        let url: string | undefined;
        if (idImage?.file) {
          try {
            url = await uploadToCloudinary(idImage.file, "image");
            setIdImageUrl(url);
          } catch {
            // Non-fatal — we still want to save the result.
          }
        }
        saveScan({ kind: "identify", imageUrl: url, hint, result: r });
      }
    } catch (e) {
      toast.error((e as Error).message || "Identification failed");
    } finally {
      setIdLoading(false);
    }
  };

  const runDiagnose = async () => {
    if (!dxImage && !symptoms.trim()) {
      toast.error("Add a photo or describe the symptoms.");
      return;
    }
    setDxLoading(true);
    setDxResult(null);
    try {
      const r = await diagnoseDisease({ imageBase64: dxImage?.base64, symptoms });
      setDxResult(r);
      if (user?.email) {
        let url: string | undefined;
        if (dxImage?.file) {
          try {
            url = await uploadToCloudinary(dxImage.file, "image");
            setDxImageUrl(url);
          } catch {
            // Non-fatal
          }
        }
        saveScan({
          kind: "diagnose",
          imageUrl: url,
          hint: symptoms,
          result: r,
        });
      }
    } catch (e) {
      toast.error((e as Error).message || "Diagnosis failed");
    } finally {
      setDxLoading(false);
    }
  };

  const handleSaveToGarden = () => {
    if (!user?.email) {
      toast.error("Sign in to save plants to your garden.");
      return;
    }
    if (!idResult) return;
    createPlant(
      {
        name: idResult.name,
        species: idResult.scientificName,
        photo: idImageUrl || undefined,
        notes: idResult.tips?.join("\n"),
      },
      {
        onSuccess: (resp: any) => {
          const id = resp?.data?._id;
          if (id) setSavedPlantId(id);
          toast.success(`${idResult.name} added to your garden 🌱`);
        },
      }
    );
  };

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setChatInput("");
    setChatLoading(true);
    try {
      const r = await chatApi(next);
      setMessages([...next, { role: "assistant", content: r.reply }]);
    } catch (e) {
      toast.error((e as Error).message || "Chat failed");
      setMessages([
        ...next,
        { role: "assistant", content: "Sorry — I hit a snag. Try again in a moment." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const suggestions = [
    "Why are my tomato leaves curling?",
    "Best companion plants for basil",
    "How to start a balcony herb garden",
    "When should I prune lavender?",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 dark:from-green-900/20 dark:via-emerald-900/10 dark:to-teal-900/20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 pt-12 pb-8 max-w-6xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-green-200/50 dark:border-green-700/50 rounded-full text-xs font-semibold text-green-700 dark:text-green-300">
              <Sparkles className="w-3.5 h-3.5" />
              LeafLink AI · 2026
            </span>
          </div>
          <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Your AI Plant Doctor
            </span>
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
            Identify any plant from a photo, diagnose what&apos;s wrong with the sick ones, and chat
            with a gardening assistant that actually knows when to water.
          </p>
          {user?.email && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link href="/ai-garden/history">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm">
                  <History className="w-4 h-4 text-emerald-600" />
                  Scan history
                </button>
              </Link>
              <Link href="/my-garden">
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700/60 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm">
                  <Sprout className="w-4 h-4 text-green-600" />
                  My Garden
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16 max-w-6xl -mt-2">
        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-sm">
            {[
              { id: "identify" as const, label: "Plant ID", icon: <Leaf className="w-4 h-4" /> },
              { id: "diagnose" as const, label: "Disease Doctor", icon: <Stethoscope className="w-4 h-4" /> },
              { id: "chat" as const, label: "Garden Chat", icon: <MessageCircle className="w-4 h-4" /> },
            ].map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30"
                      : "text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
                  }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Identify */}
        {tab === "identify" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                  <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Identify a plant</h2>
              </div>

              <ImageDrop
                preview={idImage?.preview ?? null}
                onPick={(f) => handlePickFor(f, "identify")}
                onClear={() => setIdImage(null)}
                label="Upload a plant photo"
              />

              <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Optional hint
              </label>
              <input
                value={hint}
                onChange={(e) => setHint(e.target.value)}
                placeholder='e.g. "small flower in my balcony pot"'
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />

              <button
                onClick={runIdentify}
                disabled={idLoading}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {idLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Identify plant
                  </>
                )}
              </button>
            </div>

            {/* Result */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-5 sm:p-6">
              {!idResult && !idLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 mb-4">
                    <Sprout className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">Your result appears here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                    Drop in a photo and we&apos;ll return the species, confidence, and a quick care guide.
                  </p>
                </div>
              )}

              {idLoading && (
                <div className="h-full flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-green-500" />
                  <p className="text-sm text-gray-500">Looking at the leaves…</p>
                </div>
              )}

              {idResult && (
                <div className="transition-opacity">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-green-600 dark:text-green-400 font-bold">
                        Best match
                      </p>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {idResult.name}
                      </h3>
                      <p className="italic text-sm text-gray-500 dark:text-gray-400">
                        {idResult.scientificName}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300">
                      {idResult.source === "anthropic" ? "AI" : "Demo"}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-1.5">
                      <span>Confidence</span>
                      <span>{idResult.confidence}%</span>
                    </div>
                    <ConfidenceBar value={idResult.confidence} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40">
                      <Sun className="w-4 h-4 text-amber-500 mb-1" />
                      <p className="text-[11px] font-semibold uppercase text-amber-700 dark:text-amber-300">Light</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{idResult.care?.sun}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/40">
                      <Droplets className="w-4 h-4 text-sky-500 mb-1" />
                      <p className="text-[11px] font-semibold uppercase text-sky-700 dark:text-sky-300">Water</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{idResult.care?.water}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40">
                      <Sprout className="w-4 h-4 text-emerald-500 mb-1" />
                      <p className="text-[11px] font-semibold uppercase text-emerald-700 dark:text-emerald-300">Soil</p>
                      <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{idResult.care?.soil}</p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Quick tips
                    </p>
                    <ul className="space-y-2">
                      {idResult.tips?.map((tip, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-700 dark:text-gray-300 pl-4 relative before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-green-500"
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {user?.email && (
                    <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
                      {savedPlantId ? (
                        <Link href="/my-garden">
                          <button className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                            <CheckCircle2 className="w-4 h-4" />
                            Added — open My Garden
                          </button>
                        </Link>
                      ) : (
                        <button
                          onClick={handleSaveToGarden}
                          disabled={addingPlant}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {addingPlant ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Adding…
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Save to my garden
                            </>
                          )}
                        </button>
                      )}
                      <p className="mt-1.5 text-[11px] text-center text-gray-500 dark:text-gray-400">
                        We&apos;ll track watering and remind you when it&apos;s due.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Diagnose */}
        {tab === "diagnose" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                </div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white">Diagnose a sick plant</h2>
              </div>

              <ImageDrop
                preview={dxImage?.preview ?? null}
                onPick={(f) => handlePickFor(f, "diagnose")}
                onClear={() => setDxImage(null)}
                label="Upload a photo of the problem"
              />

              <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Describe what you see
              </label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder='e.g. "yellow spots with brown rings on lower leaves"'
                rows={3}
                className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />

              <button
                onClick={runDiagnose}
                disabled={dxLoading}
                className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-rose-500 to-orange-500 shadow-md hover:shadow-lg hover:from-rose-600 hover:to-orange-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {dxLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Diagnosing…
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4" /> Diagnose
                  </>
                )}
              </button>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm p-5 sm:p-6">
              {!dxResult && !dxLoading && (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 mb-4">
                    <ShieldCheck className="w-8 h-8 text-rose-600 dark:text-rose-400" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">Diagnosis report</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                    Add a photo or describe the symptoms — we&apos;ll suggest a likely cause and treatment.
                  </p>
                </div>
              )}

              {dxLoading && (
                <div className="h-full flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                  <p className="text-sm text-gray-500">Examining the symptoms…</p>
                </div>
              )}

              {dxResult && (
                <div className="transition-opacity">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-rose-600 dark:text-rose-400 font-bold">
                        Likely problem
                      </p>
                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {dxResult.diagnosis}
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-bold rounded-full ${severityTone(dxResult.severity || "")}`}
                    >
                      {dxResult.severity}
                    </span>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-700/40">
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-bold mb-1">Cause</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{dxResult.cause}</p>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-1.5">
                      <span>Confidence</span>
                      <span>{dxResult.confidence}%</span>
                    </div>
                    <ConfidenceBar value={dxResult.confidence} />
                  </div>

                  <div className="mt-5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Treatment plan
                    </p>
                    <ol className="space-y-2">
                      {dxResult.treatment?.map((step, i) => (
                        <li key={i} className="flex gap-3 items-start">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300 pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat */}
        {tab === "chat" && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md shadow-green-500/30">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white">Garden Assistant</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online · Replies in a moment
                </p>
              </div>
            </div>

            <div className="h-[55vh] overflow-y-auto px-5 py-6 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-sky-500 to-indigo-500 text-white"
                        : "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                    }`}
                  >
                    {m.role === "user" ? "You" : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-sky-500 to-indigo-500 text-white rounded-tr-sm"
                        : "bg-gray-100 dark:bg-gray-700/60 text-gray-800 dark:text-gray-100 rounded-tl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex gap-3 transition-opacity">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700/60 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:240ms]" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="px-5 pb-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setChatInput(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300 hover:border-green-300 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700/60 bg-white/50 dark:bg-gray-900/30">
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendChat();
                    }
                  }}
                  placeholder="Ask anything about your garden…"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700/60 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={sendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 text-center">
                Tips are practical, not prescriptive. Always sanity-check with your local conditions.
              </p>
            </div>
          </div>
        )}

        {/* Feature strip */}
        <div className="mt-10 grid sm:grid-cols-3 gap-4">
          {[
            { icon: <Upload className="w-4 h-4" />, title: "Photo-first", desc: "Snap a leaf, get an answer." },
            { icon: <ShieldCheck className="w-4 h-4" />, title: "Practical", desc: "Specific, actionable steps." },
            { icon: <Sparkles className="w-4 h-4" />, title: "AI-powered", desc: "Plug in your key, get richer answers." },
          ].map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-3 p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50"
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                {f.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
