"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreHorizontal,
  Settings,
  UserPlus,
  UserCheck,
  Mail,
  Edit3,
  Camera,
  Grid3X3,
  BookmarkCheck,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Verified,
  Leaf,
  Sprout,
  Trophy,
  Flame,
  Plus,
  X,
  Send,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";

import { useUser } from "@/src/context/user.provider";
import type { TPost } from "@/src/types/post";
import { getCurrentUser } from "@/src/services/AuthService";
import UpdatePost from "@/src/components/modal/UpdatePost";
import envConfig from "@/src/config/envConfig";
import { useGetMe } from "@/src/hooks/profile";

export default function ProfilePage() {
  const { user } = useUser();
  const { data: meResponse } = useGetMe(user?.email as string);
  const me = meResponse?.data;
  const followersCount = me?.followers?.length ?? user?.followers?.length ?? 0;
  const followingCount = me?.following?.length ?? user?.following?.length ?? 0;
  const [posts, setPosts] = useState<TPost[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<TPost | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPostDetail, setShowPostDetail] = useState<TPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);

  const gardenStats = {
    plants: 24,
    harvests: 12,
    streak: 45,
    level: 3,
    xp: 75,
    nextLevel: 100,
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await getCurrentUser();
      if (!userData || !userData._id) return;

      const postsResponse = await axios.get(
        `${envConfig.baseApi}/posts/user/${userData._id}`
      );
      if (postsResponse.data.success) {
        setPosts(postsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? "Unfollowed" : "Following!");
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };

  const handleEditPost = (post: TPost) => {
    setSelectedPost(post);
    setShowModal(true);
    setShowPostDetail(null);
  };

  const handleCloseModal = () => {
    setSelectedPost(null);
    setShowModal(false);
    fetchUserData();
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await axios.delete(`${envConfig.baseApi}/posts/${postId}`);
        setPosts((prev) => prev.filter((post) => post._id !== postId));
        setShowPostDetail(null);
        toast.success("Post deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200')] bg-cover bg-center mix-blend-overlay opacity-50" />
        <button className="absolute bottom-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
          <Camera className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden bg-white dark:bg-gray-800">
                <img
                  src={user?.profilePhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                  alt={user?.name || "User"}
                  className="w-full h-full object-cover"
                />
              </div>
              {user?.isVerified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <Verified className="w-4 h-4 text-white" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-green-500 rounded-full text-white hover:bg-green-600 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {user?.name || "User Name"}
                    </h1>
                    {user?.isVerified && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        Verified Gardener
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{user?.name?.toLowerCase().replace(/\s/g, "") || "username"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {user?._id ? (
                    <>
                      <Link href="/profile/create-post">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg">
                          <Plus className="w-4 h-4" />
                          Create Post
                        </button>
                      </Link>
                      <Link href="/profile/settings">
                        <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleFollow}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                          isFollowing
                            ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4" />
                            Following
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Follow
                          </>
                        )}
                      </button>
                      <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                        <Mail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-4 max-w-2xl">
            <p className="text-gray-700 dark:text-gray-300">
              {user?.bio || "Passionate gardener sharing tips and tricks for growing beautiful plants. Join me on my green journey! 🌱🌻🍅"}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Garden City
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                <a href="#" className="text-green-600 dark:text-green-400 hover:underline">
                  leaflink.com/{user?.name?.toLowerCase().replace(/\s/g, "")}
                </a>
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
            </div>
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {followersCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {followersCount === 1 ? "Follower" : "Followers"}
              </p>
            </div>
            <div className="text-center cursor-pointer hover:opacity-80 transition-opacity">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {followingCount}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
            </div>
          </div>

          {/* Garden Progress */}
          <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-green-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                  <Leaf className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  Garden Level {gardenStats.level}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {gardenStats.xp}/{gardenStats.nextLevel} XP
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${(gardenStats.xp / gardenStats.nextLevel) * 100}%` }}
              />
            </div>
            <div className="flex items-center justify-around mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto mb-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Sprout className="w-5 h-5 text-green-600" />
                </div>
                <p className="font-bold text-gray-900 dark:text-white">{gardenStats.plants}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Plants</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto mb-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                  <Trophy className="w-5 h-5 text-amber-600" />
                </div>
                <p className="font-bold text-gray-900 dark:text-white">{gardenStats.harvests}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Harvests</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 mx-auto mb-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <p className="font-bold text-gray-900 dark:text-white">{gardenStats.streak}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === "posts"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Posts
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === "saved"
                  ? "border-green-500 text-green-600 dark:text-green-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden cursor-pointer group"
                  onClick={() => setShowPostDetail(post)}
                >
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                      <Leaf className="w-12 h-12 text-green-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-6 text-white">
                      <span className="flex items-center gap-1">
                        <Heart className="w-5 h-5 fill-current" />
                        {post.upvotes?.length || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-5 h-5" />
                        {post.comments?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Camera className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No Posts Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Share your gardening journey with the community
                </p>
                <Link href="/profile/create-post">
                  <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-md">
                    Create Your First Post
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Saved Tab */}
        {activeTab === "saved" && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <Bookmark className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Save Posts
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Posts you save will appear here
            </p>
          </div>
        )}
      </div>

      {/* Post Detail Modal */}
      {showPostDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
            <button
              onClick={() => setShowPostDetail(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="md:w-1/2 bg-black flex items-center justify-center">
              {showPostDetail.imageUrl ? (
                <img
                  src={showPostDetail.imageUrl}
                  alt={showPostDetail.title}
                  className="w-full h-full object-contain max-h-[50vh] md:max-h-none"
                />
              ) : (
                <div className="w-full h-64 md:h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600">
                  <Leaf className="w-20 h-20 text-white/50" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="md:w-1/2 flex flex-col max-h-[50vh] md:max-h-none overflow-y-auto">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user?.profilePhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500">{showPostDetail.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditPost(showPostDetail)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDeletePost(showPostDetail._id)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-4 overflow-y-auto">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {showPostDetail.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  {showPostDetail.description}
                </p>
              </div>

              {/* Actions */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(showPostDetail._id)}
                      className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          likedPosts.includes(showPostDetail._id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors">
                      <Share2 className="w-6 h-6" />
                    </button>
                  </div>
                  <button
                    onClick={() => toggleSave(showPostDetail._id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-amber-500 transition-colors"
                  >
                    {savedPosts.includes(showPostDetail._id) ? (
                      <BookmarkCheck className="w-6 h-6 fill-amber-500 text-amber-500" />
                    ) : (
                      <Bookmark className="w-6 h-6" />
                    )}
                  </button>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {showPostDetail.upvotes?.length || 0} likes
                </p>
              </div>

              {/* Comment Input */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent text-sm focus:outline-none text-gray-700 dark:text-gray-300"
                  />
                  <button className="text-green-600 dark:text-green-400 font-semibold text-sm hover:text-green-700 transition-colors">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Post Modal */}
      {showModal && selectedPost && (
        <UpdatePost
          postId={selectedPost._id}
          title={selectedPost.title}
          content={selectedPost.description}
          imageUrl={selectedPost.imageUrl}
          refreshPosts={fetchUserData}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
