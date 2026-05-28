import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { followUser } from "../services/Follow";

export const useFollowUnfollow = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationKey: ["follow_toggle"],
    mutationFn: async (payload) => await followUser(payload),
    onSuccess: (data) => {
      toast.success(data?.message);
      // Profile page reads followers/following from this query; keep it fresh
      // so the count bumps right after the follow action returns.
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
