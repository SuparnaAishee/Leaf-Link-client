import { atom, useAtom } from "jotai";
const updatePost = atom(false);
export const useShowUpdatePostModal = () => {
  return useAtom(updatePost);
};
