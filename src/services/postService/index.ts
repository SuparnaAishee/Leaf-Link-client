"use server";

import { IUpdateVote, TPost } from "@/src/types/post";
import axios from "axios";

interface ISinglePostResponseType {
  success: boolean;
  message: string;
  data: TPost;
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API, // Set your API base URL here
  headers: {
    "Content-Type": "application/json",
  },
});

// Create a post
export const createPost = async (payload: Partial<TPost>) => {
  try {
    const { data } = await axiosInstance.post("/posts/create-post", payload);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Update a post
export const updatePost = async (payload: any) => {
  try {
    const { data } = await axiosInstance.put(
      `/posts/update-post/${payload?.id}`,
      payload.data
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Upvote or downvote a post
export const upvoteOrDownvote = async (payload: IUpdateVote) => {
  try {
    const { data }: { data: ISinglePostResponseType } = await axiosInstance.put(
      "/posts/vote",
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Add post to bookmarks
export const addToBookmark = async (payload: { postId: string }) => {
  try {
    const { data }: { data: ISinglePostResponseType } = await axiosInstance.put(
      "/posts/bookmark",
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Delete a post
export const deletePost = async (id: string) => {
  try {
    const { data }: { data: ISinglePostResponseType } =
      await axiosInstance.delete(`/posts/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get a single post
export const getSinglePost = async (id: string) => {
  try {
    const { data }: { data: ISinglePostResponseType } = await axiosInstance.get(
      `/posts/${id}`
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get all posts with search, sorting, and filtering
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

    const { data } = await axiosInstance.get("/posts", { params });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get upvoters for the current user's posts
export const getUpvotersForMyPosts = async () => {
  try {
    const { data } = await axiosInstance.get("/posts/users/upvoters");
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Get the current user's posts
export const getMyMyPosts = async () => {
  try {
    const { data } = await axiosInstance.get("/profile/get-my-post");
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
