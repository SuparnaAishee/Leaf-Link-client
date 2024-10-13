// services/Follow.ts
import axios from "axios";
import { revalidateTag } from "next/cache";

// Define the type for the follow payload
export type FollowPayload = {
  followingId: string;
  followerId: string; // Ensure this line is included
};

export const followUser = async (payload: FollowPayload) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/follow",
      payload,
    );

    console.log(data);
    revalidateTag("user");

    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
