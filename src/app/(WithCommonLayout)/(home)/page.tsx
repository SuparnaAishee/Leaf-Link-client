"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Video,
  ImageIcon,
  Smile,
  Leaf,
  TreePine,
  SproutIcon as SeedlingIcon,
  Plus,
  Flower2,
  TreeDeciduous,
  Carrot,
  Sparkles,
  Crown,
} from "lucide-react";
import Footer from "@/src/components/UI/Footer";
import { useUser } from "@/src/context/user.provider";
import { useGetMe } from "@/src/hooks/profile";
import InfiniteScrollPosts from "@/src/components/post/newsfeedpost";
import Stories from "@/src/components/UI/Stories";
import Landing from "@/src/components/UI/Landing";
import Link from "next/link";

const categories = [
  { name: "Herbs", icon: <SeedlingIcon className="w-4 h-4" />, color: "from-green-400 to-emerald-500", bgColor: "bg-green-50 dark:bg-green-900/20" },
  { name: "Vegetables", icon: <Carrot className="w-4 h-4" />, color: "from-orange-400 to-amber-500", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
  { name: "Flowers", icon: <Flower2 className="w-4 h-4" />, color: "from-pink-400 to-rose-500", bgColor: "bg-pink-50 dark:bg-pink-900/20" },
  { name: "Organic", icon: <Leaf className="w-4 h-4" />, color: "from-lime-400 to-green-500", bgColor: "bg-lime-50 dark:bg-lime-900/20" },
  { name: "Indoor", icon: <TreePine className="w-4 h-4" />, color: "from-teal-400 to-cyan-500", bgColor: "bg-teal-50 dark:bg-teal-900/20" },
  { name: "Outdoor", icon: <TreeDeciduous className="w-4 h-4" />, color: "from-emerald-400 to-green-600", bgColor: "bg-emerald-50 dark:bg-emerald-900/20" },
];

const Home: React.FC = () => {
  const { user, isLoading } = useUser();
  const { data: meResponse } = useGetMe(user?.email as string);
  const me = meResponse?.data;
  const followersCount = me?.followers?.length ?? user?.followers?.length ?? 0;
  const followingCount = me?.following?.length ?? user?.following?.length ?? 0;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowCreatePost(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.email) {
    return <Landing />;
  }

  return (
    <div className="min-h-screen">
      <main className="w-full pt-2 pb-6">
        {/* Same container as navbar wrapper for perfect L/R alignment */}
        <div className="max-w-screen-2xl mx-auto w-full px-4">
          <div className="flex gap-4 justify-between">
            {/* Left Sidebar - aligned with navbar logo */}
            <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-[4.25rem] max-h-[calc(100vh-4.5rem)] overflow-y-auto scrollbar-hide space-y-3">
            {/* User Profile Card */}
            {user?.email && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Cover */}
                <div className="h-20 bg-gradient-to-r from-green-400 to-emerald-500 relative">
                  <div className="absolute -bottom-8 left-4">
                    <div className="p-1 bg-white dark:bg-gray-800 rounded-full">
                      <img
                        src={user.profilePhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-10 pb-4 px-4">
                  <Link href="/profile">
                    <h3 className="font-bold text-gray-900 dark:text-white hover:text-green-600 transition-colors">
                      {user.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{user.name?.toLowerCase().replace(/\s/g, "") || "user"}
                  </p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {followersCount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {followersCount === 1 ? "Follower" : "Followers"}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {followingCount}
                      </p>
                      <p className="text-xs text-gray-500">Following</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-500" />
                Explore Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name === selectedCategory ? "" : category.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.name
                        ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                        : `${category.bgColor} text-gray-700 dark:text-gray-300 hover:scale-105`
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            <div className="px-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div className="flex flex-wrap gap-2">
                <Link href="/about" className="hover:text-green-600">About</Link>
                <span>·</span>
                <Link href="/about" className="hover:text-green-600">Help</Link>
                <span>·</span>
                <Link href="/about" className="hover:text-green-600">Privacy</Link>
                <span>·</span>
                <Link href="/about" className="hover:text-green-600">Terms</Link>
              </div>
              <p className="mt-2">LeafLink © 2026</p>
            </div>
            </div>
          </aside>

          {/* Main Feed - centered in remaining space */}
          <div className="flex-1 min-w-0 max-w-2xl space-y-3">
            {/* Stories */}
            <Stories />

            {/* Create Post Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <img
                  src={user?.profilePhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <Link href={user?.email ? "/profile/create-post" : "/login"} className="flex-1">
                  <div className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                    What&apos;s growing in your garden?
                  </div>
                </Link>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <Link href={user?.email ? "/profile/create-post" : "/login"} className="flex-1">
                  <button className="flex items-center justify-center gap-2 py-2 w-full rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm">
                    <Video className="w-5 h-5" />
                    <span className="hidden sm:inline">Live Video</span>
                  </button>
                </Link>
                <Link href={user?.email ? "/profile/create-post" : "/login"} className="flex-1">
                  <button className="flex items-center justify-center gap-2 py-2 w-full rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-medium text-sm">
                    <ImageIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Photo</span>
                  </button>
                </Link>
                <Link href={user?.email ? "/profile/create-post" : "/login"} className="flex-1">
                  <button className="flex items-center justify-center gap-2 py-2 w-full rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors font-medium text-sm">
                    <Smile className="w-5 h-5" />
                    <span className="hidden sm:inline">Mood</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Category Filter Bar (Mobile) */}
            <div className="lg:hidden overflow-x-auto scrollbar-hide">
              <div className="flex gap-2 pb-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name === selectedCategory ? "" : category.name)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedCategory === category.name
                        ? `bg-gradient-to-r ${category.color} text-white shadow-md`
                        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {category.icon}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <InfiniteScrollPosts selectedCategory={selectedCategory} />
          </div>

          {/* Right Sidebar - aligned with navbar right icons */}
          <aside className="hidden xl:block w-64 2xl:w-72 flex-shrink-0">
            <div className="sticky top-[4.25rem] max-h-[calc(100vh-4.5rem)] overflow-y-auto scrollbar-hide space-y-3">
            {/* AI Plant Doctor Banner */}
            <Link href="/ai-garden">
              <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl p-4 text-white relative overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-bold">AI Plant Doctor</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-300 text-amber-900">
                      NEW
                    </span>
                  </div>
                  <p className="text-sm text-white/90 mb-3">
                    Snap a photo to identify any plant or diagnose disease in seconds.
                  </p>
                  <button className="w-full py-2 bg-white text-green-700 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">
                    Try it free
                  </button>
                </div>
              </div>
            </Link>

            {/* Premium Banner */}
            <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 rounded-2xl p-4 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5" />
                  <span className="font-bold">Go Premium</span>
                </div>
                <p className="text-sm text-white/90 mb-3">
                  Unlock exclusive gardening tips and connect with experts.
                </p>
                <Link href="/profile/verify-profile">
                  <button className="w-full py-2 bg-white text-orange-600 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors">
                    Upgrade Now
                  </button>
                </Link>
              </div>
            </div>

            </div>
          </aside>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      {showCreatePost && (
        <Link href={user?.email ? "/profile/create-post" : "/login"}>
          <button className="fab z-50 group">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </Link>
      )}

      <Footer />
    </div>
  );
};

export default Home;
