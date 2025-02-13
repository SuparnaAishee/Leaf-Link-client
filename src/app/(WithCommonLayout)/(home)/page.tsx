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
import InfiniteScrollPosts from "@/src/components/post/newsfeedpost";
import Footer from "@/src/components/UI/Footer";
import { useUser } from "@/src/context/user.provider";

const popularContent = [
  {
    id: 1,
    title: "Herbs",
    description: "Grow fresh herbs year-round in your home.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727790364/Indoor-Herb-Garden_s0hasl.jpg",
  },
  {
    id: 2,
    title: "Vegetables",
    description: "Learn how to cultivate a thriving vegetable garden.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727789789/LifeStyle-Homes_Home-Garden_jdiuku.jpg",
  },
  {
    id: 3,
    title: "Flowers",
    description: "Discover vibrant flowers to enhance your garden.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727790058/plant-flowers-garden_73944-17415_v4jvep.avif",
  },
];

const premiumContent = [
  {
    id: 1,
    title: "Top 10 Fruit Trees to Grow in Your Backyard",
    description: "A guide to growing the best fruit trees at home.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728741401/images_oeawhb.jpg",
  },
  {
    id: 2,
    title: "Best Herbs to Grow Indoors Year-Round",
    description: "A list of the best herbs to grow indoors anytime.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727790344/1452850519201_egwhgj.jpg",
  },
];

export default function Home() {
  const { user } = useUser();
  const isVerified = user?.isVerified;

  return (
    <section className="flex flex-col items-center justify-center gap-6 py-10">
      <div className="container mx-auto flex flex-col md:flex-row gap-6 px-4">
        {/* Left Sidebar - Popular Content */}
        <aside className="w-full md:w-1/4 p-4 bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">
            Content Categories
          </h2>
          <ul className="space-y-3">
            {popularContent.map((item) => (
              <li
                key={item.id}
                className="flex items-start p-4 bg-gray-800 rounded-lg shadow"
              >
                <img
                  alt={item.title}
                  className="w-16 h-16 rounded-md mr-4 object-cover"
                  src={item.imageUrl}
                />
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>

        {/* Middle Section - Infinite Scroll Content */}
        <main className="flex-1 p-4 bg-gray-900 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <Link passHref href="/postAction">
              <Button className="bg-purple-500">Create a Post</Button>
            </Link>
          </div>
          <InfiniteScrollPosts selectedCategory="" />
        </main>

        {/* Right Sidebar - Premium Content */}
        <aside className="w-full md:w-1/4 p-4 bg-gray-900 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-white">Premium Content</h2>
          <ul className="space-y-3">
            {premiumContent.map((item) => (
              <li
                key={item.id}
                className="flex flex-col p-4 bg-gray-800 rounded-lg shadow"
              >
                <img
                  alt={item.title}
                  className="w-full h-32 rounded-md object-cover mb-2"
                  src={item.imageUrl}
                />
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-4">
            {isVerified ? (
              <Link passHref href="/profile/premiumContent">
                <Button className="bg-purple-500">See Premium Content</Button>
              </Link>
            ) : (
              <Link passHref href="/profile/verify-profile">
                <Button className="bg-purple-500">Unlock</Button>
              </Link>
            )}
          </div>
        </aside>
      </div>
      <Footer />
    </section>
  );
}
