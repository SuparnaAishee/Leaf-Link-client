"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { IComment } from "../types/comment";
import {
  addComment,
  deleteComment,
  editComment,
  getAllComments,
  getCommentsByPost,
  getSingleComment,
} from "../services/comment";

interface ICommentResponse {
  success: boolean;
  message: string;
  data: IComment[];
}

interface ISingleCommentResponse {
  success: boolean;
  message: string;
  data: IComment;
}

export const useAddComment = () => {
  return useMutation<ICommentResponse, Error, any>({
    mutationKey: ["post_comment"],
    mutationFn: async (payload) => await addComment(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useGetAllComment = () => {
  return useQuery<any, Error, ICommentResponse>({
    queryKey: ["get_comments"],
    queryFn: async () => await getAllComments(),
  });
};

export const useGetSingleComment = (id: string) => {
  return useQuery<any, Error, ISingleCommentResponse>({
    queryKey: ["get_single_comment"],
    enabled: id ? true : false,
    queryFn: async () => await getSingleComment(id),
  });
};

export const useEditComment = () => {
  return useMutation<ICommentResponse, Error, any>({
    mutationKey: ["edit_comment"],
    mutationFn: async (payload) => await editComment(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteComment = () => {
  return useMutation<ICommentResponse, Error, any>({
    mutationKey: ["delete_comment"],
    mutationFn: async (id) => await deleteComment(id),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useGetCommentsByPost = (postId: string) => {
  return useQuery<any, Error, ICommentResponse>({
    queryKey: ["get_comments_by_post", postId],
    enabled: !!postId,
    queryFn: async () => await getCommentsByPost(postId),
  });
};
