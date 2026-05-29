"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { useUser } from "@/src/context/user.provider";
import { useCreateEvent } from "@/src/hooks/event";
import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";

const isoLocalNow = () => {
  // produce a string the datetime-local input accepts, rounded to the next hour
  const d = new Date();
  d.setMinutes(0, 0, 0);
  d.setHours(d.getHours() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useUser();
  const { mutate: createEvent, isPending } = useCreateEvent();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(isoLocalNow());
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const r = new FileReader();
    r.onloadend = () => setImagePreview(r.result as string);
    r.readAsDataURL(imageFile);
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error("Sign in to host an event.");
      return;
    }
    if (!title.trim() || !date) {
      toast.error("Title and date are required.");
      return;
    }
    let imageUrl: string | undefined;
    if (imageFile) {
      setUploading(true);
      try {
        imageUrl = await uploadToCloudinary(imageFile, "image");
      } catch {
        setUploading(false);
        toast.error("Image upload failed.");
        return;
      }
      setUploading(false);
    }

    createEvent(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        date: new Date(date).toISOString(),
        location: location.trim() || undefined,
        image: imageUrl,
      },
      {
        onSuccess: (resp: any) => {
          const id = resp?.data?._id;
          router.push(id ? `/events/${id}` : "/events");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to events
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Host an event
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Workshop, meetup, seed swap — gather the community.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 space-y-5"
        >
          {/* Cover */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              Cover image (optional)
            </label>
            <label
              htmlFor="ev-photo"
              className="cursor-pointer block aspect-video rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-green-400 transition-colors overflow-hidden"
            >
              {imagePreview ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={imagePreview}
                  alt="cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-xs">Tap to upload</span>
                </div>
              )}
              <input
                id="ev-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setImageFile(e.target.files?.[0] || null)
                }
              />
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Spring Seed Swap"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              maxLength={120}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
              What is it about?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bring 3–5 seed packets to swap. Coffee and tea provided. Beginners very welcome."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* Date + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                <Calendar className="w-3 h-3 inline mr-1" />
                When <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                <MapPin className="w-3 h-3 inline mr-1" />
                Where
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Central Park, NYC"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Link href="/events">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={isPending || uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow hover:shadow-lg transition-all disabled:opacity-60"
            >
              {isPending || uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploading ? "Uploading…" : "Creating…"}
                </>
              ) : (
                "Create event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
