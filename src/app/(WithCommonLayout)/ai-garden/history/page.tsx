"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Camera,
  Stethoscope,
  ArrowLeft,
  Trash2,
  ChevronDown,
  History,
} from "lucide-react";

import { useUser } from "@/src/context/user.provider";
import { useDeleteScan, useScans } from "@/src/hooks/garden";

type Scan = {
  _id: string;
  kind: "identify" | "diagnose";
  imageUrl?: string;
  hint?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
  createdAt: string;
};

const FALLBACK =
  "https://res.cloudinary.com/dwelabpll/image/upload/v1728055736/1620319892_kfgw3v.png";

const titleFor = (s: Scan) => {
  if (s.kind === "identify") {
    return s.result?.name || s.result?.scientificName || "Plant identified";
  }
  return s.result?.diagnosis || "Diagnosis";
};

const summaryFor = (s: Scan) => {
  if (s.kind === "identify") {
    return s.result?.scientificName || "";
  }
  return s.result?.cause || "";
};

const timeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function AiHistoryPage() {
  const { user } = useUser();
  const enabled = !!user?.email;
  const { data: response, isLoading } = useScans(enabled);
  const { mutate: removeScan } = useDeleteScan();
  const [expanded, setExpanded] = useState<string | null>(null);

  const scans: Scan[] = (response as any)?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          href="/ai-garden"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to AI Plant Doctor
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Scan history
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Every plant you&apos;ve identified or diagnosed.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Nothing here yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
              Scan a plant or a leaf on the AI Plant Doctor page and your
              results will live here.
            </p>
            <Link href="/ai-garden">
              <button className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                <Sparkles className="w-4 h-4" />
                Open AI Plant Doctor
              </button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {scans.map((s) => {
              const isOpen = expanded === s._id;
              return (
                <li
                  key={s._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(isOpen ? null : s._id)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors"
                  >
                    <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.imageUrl || FALLBACK}
                        alt={titleFor(s)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.kind === "identify"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                              : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          {s.kind === "identify" ? (
                            <Camera className="w-2.5 h-2.5" />
                          ) : (
                            <Stethoscope className="w-2.5 h-2.5" />
                          )}
                          {s.kind === "identify" ? "Identified" : "Diagnosed"}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          {timeAgo(s.createdAt)}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white truncate">
                        {titleFor(s)}
                      </p>
                      {summaryFor(s) && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic truncate">
                          {summaryFor(s)}
                        </p>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50/60 dark:bg-gray-800/60">
                      <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words font-mono leading-relaxed max-h-64 overflow-y-auto">
                        {JSON.stringify(s.result, null, 2)}
                      </pre>
                      <div className="mt-3 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm("Delete this scan?")) {
                              removeScan(s._id);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
