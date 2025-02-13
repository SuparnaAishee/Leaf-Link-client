// import InfiniteScrollPosts from "@/src/components/post/newsfeedpost";

// export default function Home() {
//   return (
//     <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
//       <div><InfiniteScrollPosts selectedCategory={""}/></div>
//     </section>
//   );
// }

// Home.tsx
"use client";

import { Button } from "@nextui-org/button";
import Link from "next/link";
import Footer from "@/src/components/UI/Footer";
import { useUser } from "@/src/context/user.provider";

const topAuthors = [
  { id: 1, name: "John Doe", avatar: "https://via.placeholder.com/50" },
  { id: 2, name: "Jane Smith", avatar: "https://via.placeholder.com/50" },
];

const recentPosts = [
  { id: 1, title: "Gardening Tips", author: "John Doe" },
  { id: 2, title: "Indoor Plants Guide", author: "Jane Smith" },
];

const featuredPosts = [
  { id: 1, title: "Best Herbs for Indoors", imageUrl: "https://via.placeholder.com/150" },
  { id: 2, title: "Growing Vegetables at Home", imageUrl: "https://via.placeholder.com/150" },
];

const tags = ["Herbs", "Vegetables", "Flowers", "Organic", "Indoor", "Outdoor"];

export default function Home() {
  const { user } = useUser();
  const isVerified = user?.isVerified;

  return (
    <section className="flex flex-col items-center gap-6 py-10">
      <div className="container mx-auto flex flex-col md:flex-row gap-6 px-4">
        {/* Left Sidebar - Top Authors */}
        <aside className="w-full md:w-1/4 p-4 bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Top Authors</h2>
          <ul className="space-y-3">
            {topAuthors.map((author) => (
              <li key={author.id} className="flex items-center gap-3">
                <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full" />
                <span className="text-white">{author.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Middle Section - Recent & Featured Posts */}
        <main className="flex-1 p-4 bg-gray-900 rounded-lg shadow-lg">
          <div className="flex justify-between mb-6">
            <input type="text" placeholder="Search by tag..." className="p-2 rounded-md w-1/2" />
          </div>
          
          <h2 className="text-xl font-bold mb-4 text-white">Recent Posts</h2>
          <ul className="space-y-3">
            {recentPosts.map((post) => (
              <li key={post.id} className="text-white">{post.title} - {post.author}</li>
            ))}
          </ul>

          <h2 className="text-xl font-bold mt-6 mb-4 text-white">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredPosts.map((post) => (
              <div key={post.id} className="bg-gray-800 p-4 rounded-lg shadow">
                <img src={post.imageUrl} alt={post.title} className="w-full h-32 object-cover rounded-md mb-2" />
                <h3 className="text-white">{post.title}</h3>
              </div>
            ))}
          </div>
        </main>

        {/* Right Sidebar - Filter by Category */}
        <aside className="w-full md:w-1/4 p-4 bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button key={tag} className="bg-purple-500 px-4 py-2 rounded-md text-white">
                {tag}
              </button>
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </section>
  );
}
