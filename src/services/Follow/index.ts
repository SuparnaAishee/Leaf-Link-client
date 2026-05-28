"use server";

import axios from "axios";
import { revalidateTag } from "next/cache";
import envConfig from "@/src/config/envConfig";

export type FollowPayload = {
  followingId: string;
  followerId: string;
};

export const followUser = async (payload: FollowPayload) => {
  try {
    const { data } = await axios.post(
      `${envConfig.baseApi}/follow`,
      payload
    );

    revalidateTag("user");
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
