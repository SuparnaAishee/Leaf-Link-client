import { useMutation } from "@tanstack/react-query";
import { followUser } from "../services/Follow";
import { toast } from "sonner";

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
