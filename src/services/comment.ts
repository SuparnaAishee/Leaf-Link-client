"use server";

import { ICommentPayload } from "@/src/types/comment";
import axiosInstance from "@/src/lib/AxiosInstance";

export const addComment = async (payload: ICommentPayload) => {
  try {
    const { data }: any = await axiosInstance.post(
      `/comment/add-comment`,
      payload
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error adding comment");
  }
};

export const getAllComments = async () => {
  try {
    const { data }: any = await axiosInstance.get(`/comment`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching comments");
  }
};

export const getSingleComment = async (id: string) => {
  try {
    const { data }: any = await axiosInstance.get(`/comment/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching comment");
  }
};

export const editComment = async (payload: {
  data: ICommentPayload;
  id: string;
}) => {
  try {
    const { data }: any = await axiosInstance.put(
      `/comment/edit-comment/${payload.id}`,
      payload.data
    );
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error editing comment");
  }
};

export const deleteComment = async (id: string) => {
  try {
    const { data }: any = await axiosInstance.delete(`/comment/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error deleting comment");
  }
};

export const getCommentsByPost = async (postId: string) => {
  try {
    const { data }: any = await axiosInstance.get(`/comment/post/${postId}/comments`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error fetching comments");
  }
};
