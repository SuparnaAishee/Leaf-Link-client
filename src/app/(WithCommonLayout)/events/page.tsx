"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Plus,
  ArrowRight,
  Clock,
} from "lucide-react";

import { useUser } from "@/src/context/user.provider";
import { useEvents } from "@/src/hooks/event";

type EventItem = {
  _id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  image?: string;
  attendees?: { _id: string; name: string; profilePhoto?: string }[];
  host?: { _id: string; name: string; profilePhoto?: string };
};

const COVER_FALLBACK =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

export default function EventsPage() {
  const { user } = useUser();
  const [scope, setScope] = useState<"upcoming" | "past">("upcoming");
  const { data, isLoading } = useEvents(scope);
  const events: EventItem[] = (data as any)?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Garden events
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Real meetups, fairs, and exchanges hosted by the community.
              </p>
            </div>
          </div>
          {user?.email && (
            <Link href="/events/create">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                <Plus className="w-4 h-4" />
                Host an event
              </button>
            </Link>
          )}
        </div>

        {/* Scope tabs */}
        <div className="inline-flex p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full mb-5">
          {(["upcoming", "past"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScope(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                scope === s
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {scope === "upcoming" ? "No upcoming events" : "No past events"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">
              {scope === "upcoming"
                ? "Be the first to host one — a seed swap, a workshop, a garden tour."
                : "Past events will appear here after their date passes."}
            </p>
            {user?.email && scope === "upcoming" && (
              <Link href="/events/create">
                <button className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                  <Plus className="w-4 h-4" />
                  Host the first event
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {events.map((ev) => (
              <Link
                key={ev._id}
                href={`/events/${ev._id}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/40 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ev.image || COVER_FALLBACK}
                    alt={ev.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">
                    {formatDate(ev.date)}
                  </p>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">
                    {ev.title}
                  </h3>
                  {ev.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {ev.description}
                    </p>
                  )}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1 truncate">
                      <Clock className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      {formatTime(ev.date)}
                    </span>
                    {ev.location && (
                      <span className="inline-flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        {ev.location}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 col-span-2">
                      <Users className="w-3.5 h-3.5 text-emerald-500" />
                      {ev.attendees?.length ?? 0}{" "}
                      {(ev.attendees?.length ?? 0) === 1 ? "going" : "going"}
                    </span>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-400 group-hover:gap-2 transition-all">
                    View event
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
