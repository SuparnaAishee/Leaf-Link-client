export default function PostSkeleton() {
  return (
    <article className="post-card animate-pulse">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="space-y-2">
            <div className="h-3 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="px-4 pb-3 space-y-2">
        <div className="h-3.5 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-5/6 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
      <div className="px-4 py-3 flex items-center gap-4">
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="ml-auto w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
    </article>
  );
}
