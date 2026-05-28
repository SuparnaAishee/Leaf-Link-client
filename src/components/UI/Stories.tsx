"use client";

import { useState } from "react";
import { Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useUser } from "@/src/context/user.provider";
import Link from "next/link";

interface Story {
  id: number;
  username: string;
  avatar: string;
  hasUnseenStory: boolean;
  isOwn?: boolean;
}

const mockStories: Story[] = [
  {
    id: 1,
    username: "Your Story",
    avatar: "",
    hasUnseenStory: false,
    isOwn: true,
  },
  {
    id: 2,
    username: "garden_guru",
    avatar: "https://res.cloudinary.com/dwelabpll/image/upload/v1728742220/portrait-young-investor-banker-workplace-260nw-2364566447_pl4b4z.jpg",
    hasUnseenStory: true,
  },
  {
    id: 3,
    username: "plant_mom",
    avatar: "https://res.cloudinary.com/dwelabpll/image/upload/v1727161761/portrait-young-indian-woman-happy-with-internship-human-resources-opportunity-mission-vision-company-values-goals-face-headshot-gen-z-pe_lsoixl.avif",
    hasUnseenStory: true,
  },
  {
    id: 4,
    username: "urban_farmer",
    avatar: "https://res.cloudinary.com/dwelabpll/image/upload/v1727161931/Testimonial-Videos-1_di6gde.png",
    hasUnseenStory: true,
  },
  {
    id: 5,
    username: "herb_master",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    hasUnseenStory: false,
  },
  {
    id: 6,
    username: "flower_power",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    hasUnseenStory: true,
  },
  {
    id: 7,
    username: "veggie_king",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    hasUnseenStory: false,
  },
  {
    id: 8,
    username: "green_thumb",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    hasUnseenStory: true,
  },
];

const storyContent = [
  {
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    caption: "My tomatoes are finally ripe!",
  },
  {
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800",
    caption: "New herbs planted today",
  },
  {
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    caption: "Morning in the garden",
  },
];

export default function Stories() {
  const { user } = useUser();
  const [viewingStory, setViewingStory] = useState<Story | null>(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const openStory = (story: Story) => {
    if (!story.isOwn) {
      setViewingStory(story);
      setStoryIndex(0);
      setProgress(0);
    }
  };

  const closeStory = () => {
    setViewingStory(null);
    setStoryIndex(0);
    setProgress(0);
  };

  const nextStory = () => {
    if (storyIndex < storyContent.length - 1) {
      setStoryIndex(storyIndex + 1);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
      setProgress(0);
    }
  };

  return (
    <>
      {/* Stories Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {mockStories.map((story) => (
            <div
              key={story.id}
              className="flex flex-col items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => openStory(story)}
            >
              {/* Story Avatar */}
              <div className="relative">
                {story.isOwn ? (
                  <Link href="/profile/create-post">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 transition-colors">
                      {user?.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt="Your story"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                            {user?.name?.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`p-0.5 rounded-full ${
                      story.hasUnseenStory
                        ? "story-ring-unseen"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <div className="p-0.5 bg-white dark:bg-gray-800 rounded-full">
                      <img
                        src={story.avatar}
                        alt={story.username}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* Username */}
              <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-16 text-center font-medium">
                {story.isOwn ? "Add Story" : story.username}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {viewingStory && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          {/* Progress Bars */}
          <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
            {storyContent.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-white rounded-full transition-all duration-100 ${
                    index < storyIndex
                      ? "w-full"
                      : index === storyIndex
                      ? "w-full animate-pulse"
                      : "w-0"
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <img
                src={viewingStory.avatar}
                alt={viewingStory.username}
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <div>
                <p className="text-white font-semibold text-sm">
                  {viewingStory.username}
                </p>
                <p className="text-white/70 text-xs">2h ago</p>
              </div>
            </div>
            <button
              onClick={closeStory}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Story Content */}
          <div className="relative w-full max-w-lg h-full max-h-[80vh] mx-4">
            <img
              src={storyContent[storyIndex].image}
              alt="Story"
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Caption */}
            <div className="absolute bottom-8 left-4 right-4">
              <p className="text-white text-center font-medium bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2">
                {storyContent[storyIndex].caption}
              </p>
            </div>
          </div>

          {/* Navigation Areas */}
          <button
            onClick={prevStory}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextStory}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Click areas for navigation */}
          <div
            className="absolute left-0 top-0 w-1/3 h-full cursor-pointer"
            onClick={prevStory}
          />
          <div
            className="absolute right-0 top-0 w-1/3 h-full cursor-pointer"
            onClick={nextStory}
          />
        </div>
      )}
    </>
  );
}
