"use server";

import axios from "axios";
import { ICommentPayload } from "@/src/types/comment";

// Base axios instance for handling API requests
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", // replace with your base API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a comment
export const addComment = async (payload: ICommentPayload) => {
  try {
    const { data }: any = await axiosInstance.post(
      `/comments/add-comment`,
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error adding comment");
  }
};

// Get all comments
export const getAllComments = async () => {
  try {
    const { data }: any = await axiosInstance.get(`/comments`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching comments");
  }
};

// Get a single comment by ID
export const getSingleComment = async (id: string) => {
  try {
    const { data }: any = await axiosInstance.get(`/comments/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching comment");
  }
};

// Edit a comment
export const editComment = async (payload: {
  data: ICommentPayload;
  id: string;
}) => {
  try {
    const { data }: any = await axiosInstance.put(
      `/comments/edit-comment/${payload.id}`,
      payload.data
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error editing comment");
  }
};

// Delete a comment
export const deleteComment = async (id: string) => {
  try {
    const { data }: any = await axiosInstance.delete(`/comments/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error deleting comment");
  }
};

// import axios from "axios";

// const API_URL = "http://localhost:5000/api/comments";

// export const addComment = async (
//   postId: string,
//   userId: string,
//   commentText: string
// ) => {
//   try {
//     const response = await axios.post(`${API_URL}/add-comment`, {
//       post: postId,
//       user: userId,
//       comment: commentText,
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Failed to post comment", error);
//     throw error;
//   }
// };

// export const getComments = async (postId: string) => {
//   try {
//     const response = await axios.get(`${API_URL}?postId=${postId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to get comments", error);
//     throw error;
//   }
// };
