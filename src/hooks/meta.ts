"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminStats } from "../services/meta";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    // Wrap so the server action is called with no args — passing it directly
    // hands react-query's (non-serializable) context to the server action.
    queryFn: async () => await getAdminStats(),
  });
};
