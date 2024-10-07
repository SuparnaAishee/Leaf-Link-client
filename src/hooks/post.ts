"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addToBookmark,
  createPost,
  deletePost,
  getAllPost,
  getMyMyPosts,
  getSinglePost,
  getUpvotersForMyPosts,
  updatePost,
  upvoteOrDownvote,
} from "../services/postService";

import { toast } from "sonner";
import { IUpdateVote, TPost } from "../types/post";
import { IUser } from "../types/user";
import { IResponse } from "../types";

interface IPostProps {
  message: string;
  success: boolean;
  data: TPost;
}
interface IUpvotersProps {
  message: string;
  success: boolean;
  data: IUser[];
}

export const useCreatePost = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["CREATE_POST"],
    mutationFn: async (payload: Partial<TPost>) => await createPost(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdatePost = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["Update_POST"],
    mutationFn: async (payload: any) => await updatePost(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useAddVote = () => {
  return useMutation<any, Error, IUpdateVote>({
    mutationKey: ["ADD_VOTE"],
    mutationFn: async (payload: IUpdateVote) => await upvoteOrDownvote(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
export const useAddBookmark = () => {
  return useMutation<any, Error, { postId: string }>({
    mutationKey: ["Bookmark"],
    mutationFn: async (payload: { postId: string }) =>
      await addToBookmark(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useDeletePost = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["DELETE_POST"],
    mutationFn: async (id) => await deletePost(id),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useGetSInglePost = (id: string) => {
  return useQuery<any, Error, IPostProps>({
    queryKey: [`SINGLE_POST${id}`],
    enabled: id ? true : false,
    queryFn: async () => await getSinglePost(id),
  });
};

export const useGetAllPost = (query: any) => {
  return useQuery<any, Error, IResponse<TPost[] | undefined>>({
    queryKey: [`GET_ALL_POST`, query],
    queryFn: async () => await getAllPost(query),
  });
};

export const useGetUpvoters = (email: string) => {
  return useQuery<any, Error, IUpvotersProps>({
    queryKey: [`upvoters`],
    enabled: email ? true : false,
    queryFn: async () => await getUpvotersForMyPosts(),
  });
};
export const useGetMyPost = () => {
  return useQuery<any, Error, any>({
    queryKey: [`get_my_posts`],
    queryFn: async () => await getMyMyPosts(),
  });
};
