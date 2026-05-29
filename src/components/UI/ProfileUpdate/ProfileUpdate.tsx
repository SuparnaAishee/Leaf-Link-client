"use client";

import { useEffect, useRef, useState, ChangeEvent, DragEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { FieldValues, SubmitHandler, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  Camera,
  Upload,
  X,
  Lock,
  Verified,
  User as UserIcon,
  AlertCircle,
  Loader2,
  ImagePlus,
  Edit3,
  ArrowLeft,
} from "lucide-react";

import LLInput from "../../form/LLInput";
import LLForm from "../../form/LLFrom";
import LLTextarea from "../../form/LLTextArea";

import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import { logout } from "@/src/services/AuthService";
import { useUpdateProfile, useGetMe } from "@/src/hooks/profile";
import { useUser } from "@/src/context/user.provider";

const MAX_SIZE_MB = 5;
const ACCEPT = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const FALLBACK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
const COVER_IMAGE =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200";

type Profile = {
  name: string;
  email: string;
  mobileNumber?: string;
  profilePhoto?: string;
  bio?: string;
  isVerified?: boolean;
  premiumStatus?: boolean;
  followers?: unknown[];
  following?: unknown[];
  posts?: unknown[];
};

// Live name from the form (so the header matches what the user is typing)
const LiveName = ({ fallback }: { fallback: string }) => {
  const name = useWatch({ name: "name" });
  return <>{(name as string)?.trim() || fallback}</>;
};

const LiveUsername = ({ fallback }: { fallback: string }) => {
  const name = useWatch({ name: "name" });
  const value = ((name as string) || fallback).toLowerCase().replace(/\s/g, "");
  return <>@{value || "username"}</>;
};

const Section = ({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-green-100 dark:border-gray-700 shadow-sm p-5 sm:p-6">
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
    {children}
  </div>
);

const Skeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="h-48 md:h-64 lg:h-80 bg-gray-200 dark:bg-gray-800 animate-pulse" />
    <div className="max-w-5xl mx-auto px-4">
      <div className="relative -mt-20 mb-6 flex gap-4">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 dark:bg-gray-700 animate-pulse" />
        <div className="flex-1 pb-4 space-y-3">
          <div className="h-7 w-48 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
        <div className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
      </div>
    </div>
  </div>
);

const ProfileUpdate = () => {
  const router = useRouter();
  const { user: ctxUser, setIsLoading: setUserLoading } = useUser();
  const { data: meResponse, isLoading: meLoading } = useGetMe(
    ctxUser?.email as string
  );
  const me = meResponse?.data as Profile | undefined;

  const { mutate: handleUpdateProfile } = useUpdateProfile();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const validateFile = (file: File) => {
    if (!ACCEPT.includes(file.type)) {
      toast.error("Please upload a PNG, JPEG, or WebP image.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be under ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!validateFile(file)) return;
    setImageFile(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit: SubmitHandler<FieldValues> = async (profileData) => {
    setLoading(true);
    try {
      const payload: FieldValues = { ...profileData };

      if (imageFile) {
        setUploading(true);
        const imageUrl = await uploadToCloudinary(imageFile, "image");
        setUploading(false);
        payload.profilePhoto = imageUrl;
      }

      handleUpdateProfile(payload, {
        onSuccess() {
          setLoading(false);
          logout();
          setUserLoading(true);
          router.push("/login?redirect=/profile");
        },
        onError() {
          setLoading(false);
        },
      });
    } catch {
      setUploading(false);
      setLoading(false);
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (meLoading || !me) {
    return <Skeleton />;
  }

  const avatarSrc = imagePreview || me.profilePhoto || FALLBACK_AVATAR;
  const followersCount = me.followers?.length ?? 0;
  const followingCount = me.following?.length ?? 0;
  const postsCount = me.posts?.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* ─────────────── Cover (same as view profile) ─────────────── */}
      <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
        <div className="absolute inset-0 bg-black/20" />
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-50"
          style={{ backgroundImage: `url('${COVER_IMAGE}')` }}
        />
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider border border-white/20">
          <Edit3 className="w-3.5 h-3.5" />
          Editing profile
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
          aria-label="Change profile photo"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <LLForm
        defaultValues={{
          name: me.name,
          mobileNumber: me.mobileNumber ?? "",
          email: me.email,
          bio: me.bio ?? "",
        }}
        onSubmit={handleSubmit}
      >
        <div className="max-w-5xl mx-auto px-4 pb-12">
          {/* ─────────────── Profile header (mirrors view profile) ─────────────── */}
          <div className="relative -mt-20 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              {/* Avatar with click + drag-and-drop upload */}
              <label
                htmlFor="avatar-upload"
                className="relative cursor-pointer group self-start"
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div
                  className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white dark:bg-gray-800 transition-all ${
                    dragOver ? "ring-4 ring-green-500/50 scale-[1.03]" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarSrc}
                    alt={me.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {me.isVerified && (
                  <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <Verified className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                  <span className="text-xs mt-1 font-medium">
                    {dragOver ? "Drop image" : "Change photo"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}
                  className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors shadow-lg"
                  aria-label="Upload photo"
                >
                  <Camera className="w-4 h-4" />
                </button>

                <input
                  ref={fileInputRef}
                  id="avatar-upload"
                  type="file"
                  accept={ACCEPT.join(",")}
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleFile(e.target.files?.[0])
                  }
                />
              </label>

              {/* Profile info + action buttons */}
              <div className="flex-1 pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        <LiveName fallback={me.name} />
                      </h1>
                      {me.isVerified && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                          Verified Gardener
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      <LiveUsername fallback={me.name} />
                    </p>
                  </div>

                  {/* Cancel / Save (mirrors view-profile's action area) */}
                  <div className="flex items-center gap-3">
                    <Link href="/profile">
                      <button
                        type="button"
                        className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Cancel
                      </button>
                    </Link>
                    <Button
                      type="submit"
                      isLoading={loading}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      {loading ? "Saving…" : "Save changes"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo-upload status (matches view-profile's bio strip placement) */}
            <div className="mt-4 max-w-2xl flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                  Uploading photo…
                </>
              ) : imageFile ? (
                <>
                  <ImagePlus className="w-4 h-4 text-green-600" />
                  <span>New photo ready</span>
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    className="text-rose-600 dark:text-rose-400 text-xs hover:underline flex items-center gap-1 ml-1"
                  >
                    <X className="w-3 h-3" /> discard
                  </button>
                </>
              ) : (
                <>
                  <ImagePlus className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400">
                    Click your photo or drag a file onto it · JPG/PNG/WebP up to{" "}
                    {MAX_SIZE_MB}MB
                  </span>
                </>
              )}
            </div>

            {/* Stats row (identical to view profile) */}
            <div className="flex items-center gap-6 mt-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {postsCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Posts
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {followersCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {followersCount === 1 ? "Follower" : "Followers"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {followingCount}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Following
                </p>
              </div>
            </div>
          </div>

          {/* ─────────────── Form sections ─────────────── */}
          <div className="space-y-4">
            <Section
              icon={<UserIcon className="w-4 h-4" />}
              title="Personal information"
              description="Visible to other gardeners on your profile and posts."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LLInput label="Full name" name="name" required />
                <LLInput label="Mobile number" name="mobileNumber" type="tel" />
              </div>
              <div className="mt-4">
                <LLTextarea label="Bio" name="bio" />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  A short intro — what do you grow? What&apos;s your garden
                  style?
                </p>
              </div>
            </Section>

            <Section
              icon={<Lock className="w-4 h-4" />}
              title="Account"
              description="Locked fields can&apos;t be changed for security reasons."
            >
              <LLInput
                label="Email"
                name="email"
                type="email"
                readonly
                disabled
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Email is linked to your account and can&apos;t be edited here.
              </p>
            </Section>

            <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50 p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-100">
                <strong>Heads up:</strong> you&apos;ll be signed out after
                saving so we can refresh your session. Sign back in to see the
                changes everywhere.
              </div>
            </div>

            {/* Bottom action row (mirrors header on mobile when scrolled) */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link href="/profile">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-full font-medium text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <Button
                type="submit"
                isLoading={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-full px-6 shadow-md hover:shadow-lg transition-all"
              >
                {loading ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        </div>
      </LLForm>
    </div>
  );
};

export default ProfileUpdate;
