// src/hooks/useSearchUsers.ts
import { useQuery } from "@tanstack/react-query";

import { searchUsers } from "../services/search/search";

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ["searchUsers", query],
    queryFn: () => searchUsers(query),
    enabled: !!query && query.length > 2, // Enable query if query has more than 2 characters
  });
};
