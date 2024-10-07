"use server"; // Ensures these functions are executed on the server side.


import axiosInstance from "@/src/lib/AxiosInstance";
import { IUpdateVote, TPost } from "@/src/types/post";


import { revalidateTag } from "next/cache";

interface ISinglePostResponseType {
  success: boolean;
  message: string;
  data: TPost;
}

// Create Post
export const createPost = async (payload: Partial<TPost>) => {
  try {
    const { data }: any = await axiosInstance.post(
      `/posts/create-post`,
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Update Post
export const updatePost = async (payload: any) => {
  try {
    const { data }: any = await axiosInstance.put(
      `/posts/update-post/${payload?.id}`,
      payload.data
    );
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Upvote or Downvote Post
export const upvoteOrDownvote = async (payload: IUpdateVote) => {
  try {
    const { data }: any = await axiosInstance.put(`/posts/vote`, payload);
    revalidateTag("post"); // Revalidate the cache for "post"
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Add to Bookmark
export const addToBookmark = async (payload: { postId: string }) => {
  try {
    const { data }: any = await axiosInstance.put(`/posts/bookmark`, payload);
    revalidateTag("post");
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Delete Post
export const deletePost = async (id: string) => {
  try {
    const { data }: any = await axiosInstance.delete(`/posts/${id}`);
    revalidateTag("post");
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Get Single Post
export const getSinglePost = async (id: string) => {
  try {
    const { data }: any = await axiosInstance.get(`/posts/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Get All Posts
export const getAllPost = async (query: any) => {
  try {
    const params = new URLSearchParams();
    if (query?.searchTerm) {
      params.append("searchTerm", query.searchTerm);
    }
    if (query?.sort) {
      params.append("sort", query.sort);
    }
    if (query?.filter) {
      params.append("filter", query.filter);
    }

    const { data }: any = await axiosInstance.get(`/posts`, { params });
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Get Upvoters for My Posts
export const getUpvotersForMyPosts = async () => {
  try {
    const { data }: any = await axiosInstance.get(`/posts/users/upvoters`);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};

// Get My Posts
export const getMyPosts = async () => {
  try {
    const { data }: any = await axiosInstance.get(`/profile/get-my-post`);
    return data;
  } catch (error: any) {
    throw new Error(error);
  }
};
