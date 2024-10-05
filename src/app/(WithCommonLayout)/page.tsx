import InfiniteScrollPosts from "./post/page";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div><InfiniteScrollPosts selectedCategory={""}/></div>
    </section>
  );
}
