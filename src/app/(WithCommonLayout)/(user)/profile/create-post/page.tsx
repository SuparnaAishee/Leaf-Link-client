"use client";

import { ChangeEvent, useRef, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Checkbox } from "@nextui-org/checkbox";
import {
  ChevronDown,
  ChevronUp,
  Crown,
  ImagePlus,
  Leaf,
  Loader2,
  X,
} from "lucide-react";
import {
  Carrot,
  Flower2,
  SproutIcon as SeedlingIcon,
  TreeDeciduous,
  TreePine,
} from "lucide-react";
import { toast } from "sonner";

import { useCreatePost } from "@/src/hooks/post";
import { useUser } from "@/src/context/user.provider";
import { useGetMe } from "@/src/hooks/profile";
import { uploadToCloudinary } from "@/src/utils/uploadToCloudinary";
import Editor from "@/src/components/UI/Editor/Editor";

const CATEGORIES = [
  { name: "Herbs", Icon: SeedlingIcon, color: "from-green-400 to-emerald-500" },
  { name: "Vegetables", Icon: Carrot, color: "from-orange-400 to-amber-500" },
  { name: "Flowers", Icon: Flower2, color: "from-pink-400 to-rose-500" },
  { name: "Organic", Icon: Leaf, color: "from-lime-400 to-green-500" },
  { name: "Indoor", Icon: TreePine, color: "from-teal-400 to-cyan-500" },
  { name: "Outdoor", Icon: TreeDeciduous, color: "from-emerald-400 to-green-600" },
];

const BLANK_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const TITLE_MAX = 120;
const DESC_MAX = 280;

const CreatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // @ts-ignore — user provider exposes a query field used for cache invalidation
  const { user, query } = useUser();
  const { data: me } = useGetMe(user?.email as string);
  const { mutate: createPost } = useCreatePost();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState("");
  const [content, setContent] = useState("");
  const [showRichEditor, setShowRichEditor] = useState(false);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>();

  const title = watch("title") || "";
  const description = watch("description") || "";

  const canPublish =
    title.trim().length > 0 &&
    (category || customCategory).trim().length > 0 &&
    !publishing &&
    !uploadingImage;

  const eligibleForPremium = me?.data?.isVerified && me?.data?.premiumStatus;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please pick an image file");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(undefined);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearAll = () => {
    reset();
    setContent("");
    setCategory("");
    setCustomCategory("");
    setIsPremium(false);
    setShowRichEditor(false);
    removeImage();
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!user?._id) {
      toast.error("Please log in to publish a post");
      router.push("/login");
      return;
    }

    setPublishing(true);
    try {
      const postData: any = {
        user: user._id,
        title: (data.title || "").trim(),
        category: (customCategory || category).trim(),
        description: (data.description || "").trim() || undefined,
        content: content || undefined,
        isPremium: eligibleForPremium ? isPremium : false,
      };

      if (image) {
        const imageUrl = await uploadToCloudinary(image as File, "image");
        if (imageUrl) postData.imageUrl = imageUrl;
      }

      createPost(postData, {
        onSuccess: () => {
          clearAll();
          queryClient.invalidateQueries({ queryKey: [`GET_ALL_POST`, query] });
          router.push("/");
        },
        onSettled: () => setPublishing(false),
      });
    } catch (err: any) {
      toast.error(err?.message || "Couldn't publish — try again");
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h1 className="font-bold text-gray-900 dark:text-white text-lg">
              Create a post
            </h1>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Author row */}
          <div className="px-5 pt-4 flex items-center gap-3">
            <img
              src={user?.profilePhoto || BLANK_AVATAR}
              alt={user?.name || "You"}
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {user?.name || "You"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sharing with the LeafLink community
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="px-5 pt-4">
            <input
              {...register("title", {
                required: true,
                maxLength: TITLE_MAX,
              })}
              type="text"
              placeholder="What's growing in your garden?"
              maxLength={TITLE_MAX}
              className="w-full bg-transparent text-xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            <div className="flex items-center justify-between mt-1">
              {errors.title ? (
                <span className="text-xs text-red-500">Title is required</span>
              ) : (
                <span className="text-xs text-gray-400">
                  Make it specific — e.g. &ldquo;Pruning basil for bushier
                  growth&rdquo;
                </span>
              )}
              <span
                className={`text-xs ${
                  title.length > TITLE_MAX - 20
                    ? "text-amber-500"
                    : "text-gray-400"
                }`}
              >
                {title.length}/{TITLE_MAX}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="px-5 pt-4">
            <textarea
              {...register("description", { maxLength: DESC_MAX })}
              placeholder="Add a short caption (optional)…"
              rows={3}
              maxLength={DESC_MAX}
              className="w-full bg-transparent text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 resize-none focus:outline-none"
            />
            <div className="flex justify-end">
              <span
                className={`text-xs ${
                  description.length > DESC_MAX - 30
                    ? "text-amber-500"
                    : "text-gray-400"
                }`}
              >
                {description.length}/{DESC_MAX}
              </span>
            </div>
          </div>

          {/* Image picker */}
          <div className="px-5 pt-3">
            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 py-7 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/40 dark:hover:bg-green-900/10 transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Add a photo
                  </p>
                  <p className="text-xs text-gray-500">PNG or JPG, up to ~5MB</p>
                </div>
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full max-h-[420px] object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                )}
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Categories */}
          <div className="px-5 pt-5">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pick a category <span className="text-red-500">*</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ name, Icon, color }) => {
                const active = category === name && !customCategory;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setCategory(name);
                      setCustomCategory("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      active
                        ? `bg-gradient-to-r ${color} text-white shadow-md`
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-105"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {name}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                if (e.target.value) setCategory("");
              }}
              placeholder="…or type your own category"
              className="mt-3 w-full bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Rich editor toggle */}
          <div className="px-5 pt-5">
            <button
              type="button"
              onClick={() => setShowRichEditor((v) => !v)}
              className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700"
            >
              {showRichEditor ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              {showRichEditor ? "Hide detailed content" : "Add detailed content"}
            </button>
            {showRichEditor && (
              <div className="mt-3 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                <Editor
                  content={content}
                  setContent={setContent}
                  setUploadingImage={setUploadingImage}
                />
              </div>
            )}
          </div>

          {/* Premium toggle */}
          {eligibleForPremium && (
            <div className="px-5 pt-5">
              <label className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-100 dark:border-amber-800 cursor-pointer">
                <Checkbox
                  isSelected={isPremium}
                  onValueChange={setIsPremium}
                  color="warning"
                />
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Mark as premium content
                  </span>
                </div>
              </label>
            </div>
          )}

          {/* Footer */}
          <div className="px-5 py-4 mt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {canPublish
                ? "Ready when you are."
                : "Add a title and a category to publish."}
            </p>
            <button
              type="submit"
              disabled={!canPublish}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md"
            >
              {publishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Leaf className="w-4 h-4" />
                  Publish
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
