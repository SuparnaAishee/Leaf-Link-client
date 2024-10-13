import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { followUser } from "../services/Follow";

export const useFollowUnfollow = () => {
  return useMutation<any, Error, any>({
    mutationKey: ["user"],
    mutationFn: async (payload) => await followUser(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
