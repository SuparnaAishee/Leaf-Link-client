"use client";

import { useEffect, useMemo, useState, ChangeEvent } from "react";
import Link from "next/link";
import {
  Sprout,
  Plus,
  Droplet,
  Trash2,
  X,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Leaf,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/src/context/user.provider";
import {
  useCreatePlant,
  useDeletePlant,
  usePlants,
  useWaterPlant,
} from "@/src/hooks/garden";
import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";

type Plant = {
  _id: string;
  name: string;
  species?: string;
  photo?: string;
  plantedAt?: string;
  waterIntervalDays?: number;
  lastWateredAt?: string;
  notes?: string;
};

const FALLBACK_PHOTO =
  "https://res.cloudinary.com/dwelabpll/image/upload/v1728055736/1620319892_kfgw3v.png";

const computeNextWater = (p: Plant) => {
  const start = new Date(p.lastWateredAt || p.plantedAt || Date.now());
  const days = p.waterIntervalDays ?? 7;
  return new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
};

const daysSince = (iso?: string) => {
  if (!iso) return 0;
  return Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000))
  );
};

export default function MyGardenPage() {
  const { user } = useUser();
  const enabled = !!user?.email;
  const { data: response, isLoading } = usePlants(enabled);
  const { mutate: createPlant, isPending: creating } = useCreatePlant();
  const { mutate: water } = useWaterPlant();
  const { mutate: removePlant } = useDeletePlant();

  const plants: Plant[] = (response as any)?.data || [];
  const dueCount = useMemo(
    () => plants.filter((p) => computeNextWater(p).getTime() <= Date.now()).length,
    [plants]
  );

  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [waterInterval, setWaterInterval] = useState(7);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview("");
      return;
    }
    const r = new FileReader();
    r.onloadend = () => setPhotoPreview(r.result as string);
    r.readAsDataURL(photoFile);
  }, [photoFile]);

  const resetForm = () => {
    setName("");
    setSpecies("");
    setWaterInterval(7);
    setPhotoFile(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Give your plant a name");
      return;
    }
    let photoUrl: string | undefined;
    if (photoFile) {
      try {
        photoUrl = await uploadToCloudinary(photoFile, "image");
      } catch {
        toast.error("Photo upload failed");
        return;
      }
    }
    createPlant(
      {
        name: name.trim(),
        species: species.trim() || undefined,
        photo: photoUrl,
        waterIntervalDays: waterInterval,
      },
      {
        onSuccess: () => {
          resetForm();
          setShowAdd(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My Garden
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {plants.length === 0
                  ? "Track every plant you grow"
                  : `${plants.length} ${plants.length === 1 ? "plant" : "plants"} growing`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            Add a plant
          </button>
        </div>

        {/* Due banner */}
        {dueCount > 0 && (
          <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/60">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                {dueCount} {dueCount === 1 ? "plant needs" : "plants need"} water today
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Tap the watering can on each one once you&apos;ve given it a drink.
              </p>
            </div>
          </div>
        )}

        {/* Empty / grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : plants.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Sprout className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Your garden is empty
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-6">
              Add your first plant manually, or snap a photo on the AI Plant
              Doctor and save it straight to your garden.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowAdd(true)}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Add a plant
              </button>
              <Link href="/ai-garden">
                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  Try AI Plant Doctor
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plants.map((p) => {
              const next = computeNextWater(p);
              const isDue = next.getTime() <= Date.now();
              const sinceWater = daysSince(p.lastWateredAt || p.plantedAt);
              return (
                <div
                  key={p._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.photo || FALLBACK_PHOTO}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                    {isDue && (
                      <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/95 text-white text-[10px] font-bold uppercase tracking-wider">
                        <Droplet className="w-2.5 h-2.5" />
                        Due
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {p.name}
                    </h3>
                    {p.species && (
                      <p className="text-xs text-gray-500 italic">
                        {p.species}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Droplet className="w-3 h-3 text-blue-500" />
                        {sinceWater === 0
                          ? "Watered today"
                          : `${sinceWater}d ago`}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-green-500" />
                        every {p.waterIntervalDays ?? 7}d
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => water(p._id)}
                        className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-colors ${
                          isDue
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm hover:shadow"
                            : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50"
                        }`}
                      >
                        {isDue ? (
                          <>
                            <Droplet className="w-3.5 h-3.5" />
                            Water now
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Watered
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${p.name}?`))
                            removePlant(p._id);
                        }}
                        className="p-2 rounded-full text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                        aria-label="Remove plant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowAdd(false)}
        >
          <form
            onSubmit={handleAdd}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                <h2 className="font-bold">Add a plant</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="p-1 rounded-full hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Photo
                </label>
                <label
                  htmlFor="plant-photo"
                  className="cursor-pointer block aspect-video rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-green-400 transition-colors overflow-hidden relative"
                >
                  {photoPreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={photoPreview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs">Tap to upload (optional)</span>
                    </div>
                  )}
                  <input
                    id="plant-photo"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPhotoFile(e.target.files?.[0] || null)
                    }
                  />
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Basil on the kitchen sill"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Species (optional)
                </label>
                <input
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  placeholder="Ocimum basilicum"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                  Water every (days)
                </label>
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={waterInterval}
                  onChange={(e) =>
                    setWaterInterval(Math.max(1, Number(e.target.value) || 7))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow disabled:opacity-50"
              >
                {creating ? "Adding…" : "Add plant"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
