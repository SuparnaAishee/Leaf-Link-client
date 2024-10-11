import copy from "copy-to-clipboard";
import { toast } from "sonner";

const handleCopyPostURL = (id: string) => {
  copy(`${window.location.origin}/posts/${id}`);
  toast.success("Successfully copied the post url!");
};

export default handleCopyPostURL;
