"use server";

import { revalidateTag } from "next/cache";
import axiosInstance from "@/src/lib/AxiosInstance";

export type FollowPayload = {
  followingId: string;
};

export const followUser = async (payload: FollowPayload) => {
  try {
    const { data } = await axiosInstance.post(`/follow`, payload);

    revalidateTag("user");
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
