"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  MapPin,
  Trash2,
  UserPlus,
  Users,
  Verified,
} from "lucide-react";

import { useUser } from "@/src/context/user.provider";
import {
  useDeleteEvent,
  useEvent,
  useToggleRsvp,
} from "@/src/hooks/event";

const COVER_FALLBACK =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200";
const BLANK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const formatLong = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function EventDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading } = useEvent(params?.id || "");
  const { mutate: toggleRsvp, isPending: rsvping } = useToggleRsvp();
  const { mutate: remove } = useDeleteEvent();

  const ev = (data as any)?.data;
  const isHost = ev?.host?._id && user?._id && ev.host._id === user._id;
  const isGoing =
    !!user?._id &&
    Array.isArray(ev?.attendees) &&
    ev.attendees.some((a: any) => a?._id === user._id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          <div className="h-72 rounded-3xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-8 w-1/2 rounded bg-gray-200 dark:bg-gray-800 animate-pulse" />
          <div className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!ev) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 dark:text-gray-300 font-semibold">
            Event not found
          </p>
          <Link href="/events">
            <button className="mt-4 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold">
              Back to events
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          All events
        </Link>

        {/* Cover */}
        <div className="relative aspect-video sm:aspect-[3/1] rounded-3xl overflow-hidden bg-gradient-to-br from-green-200 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ev.image || COVER_FALLBACK}
            alt={ev.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title block */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar className="w-3 h-3" />
              {new Date(ev.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              {ev.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-green-500" />
                {formatLong(ev.date)}
              </span>
              {ev.location && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  {ev.location}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-500" />
                {ev.attendees?.length ?? 0} going
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            {user?.email ? (
              <button
                onClick={() => toggleRsvp(ev._id)}
                disabled={rsvping}
                className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm shadow transition-all ${
                  isGoing
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                } disabled:opacity-60`}
              >
                {isGoing ? (
                  <>
                    <Check className="w-4 h-4" />
                    Going
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    RSVP
                  </>
                )}
              </button>
            ) : (
              <Link href="/login">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:shadow-lg">
                  Sign in to RSVP
                </button>
              </Link>
            )}

            {isHost && (
              <button
                onClick={() => {
                  if (window.confirm("Delete this event?")) {
                    remove(ev._id, {
                      onSuccess: () => router.push("/events"),
                    });
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete event
              </button>
            )}
          </div>
        </div>

        {/* Host card + description */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              About this event
            </h3>
            {ev.description ? (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                {ev.description}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">
                The host hasn&apos;t added a description yet.
              </p>
            )}
          </div>

          <aside className="space-y-4">
            {/* Host */}
            {ev.host && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Hosted by
                </h3>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ev.host.profilePhoto || BLANK_AVATAR}
                    alt={ev.host.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white flex items-center gap-1">
                      {ev.host.name}
                      {ev.host.isVerified && (
                        <Verified className="w-3.5 h-3.5 text-green-500" />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Attendees */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                Attendees ({ev.attendees?.length ?? 0})
              </h3>
              {ev.attendees?.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  Be the first to RSVP.
                </p>
              ) : (
                <ul className="space-y-2">
                  {(ev.attendees as any[])
                    .slice(0, 6)
                    .map((a) => (
                      <li
                        key={a._id}
                        className="flex items-center gap-2"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={a.profilePhoto || BLANK_AVATAR}
                          alt={a.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                          {a.name}
                        </span>
                      </li>
                    ))}
                  {(ev.attendees as any[]).length > 6 && (
                    <li className="text-xs text-gray-500 pl-9">
                      +{(ev.attendees as any[]).length - 6} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
