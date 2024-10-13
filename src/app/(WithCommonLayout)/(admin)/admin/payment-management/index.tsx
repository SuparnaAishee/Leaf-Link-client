import PostCard from "@/src/components/postCard";
import axiosInstance from "@/src/lib/AxiosInstance";
import { TPost } from "@/src/types";

export default async function PostManagement() {
  const { data }: any = await axiosInstance.get("/posts");

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <div className="w-full grid justify-center gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 p-5">
        {data?.data?.map((post: TPost) => (
          <PostCard key={post?._id} post={post} />
        ))}
      </div>
    </section>
  );
}
