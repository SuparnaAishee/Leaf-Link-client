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
    title: "Herbs ",
    description: "Description for  item 1.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727790364/Indoor-Herb-Garden_s0hasl.jpg",
  },
  {
    id: 2,
    title: "Vegetables",
    description: "Description for popular item 2.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727789789/LifeStyle-Homes_Home-Garden_jdiuku.jpg",
  },
  {
    id: 3,
    title: "Flowers",
    description: "Description for popular item 3.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727790058/plant-flowers-garden_73944-17415_v4jvep.avif",
  },
  {
    id: 4,
    title: "Soil Health",
    description: "Description for popular item 4.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727793288/images_5_o5keoz.jpg",
  },
  {
    id: 5,
    title: "Techniques",
    description: "Description for popular item 4.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727789751/pwuXPTXV9k8FYmiJK2UTQM_jgr5re.jpg",
  },
  {
    id: 6,
    title: "Garden Design",
    description: "Description for popular item 4.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727798378/oddgardens_rwuvet.jpg",
  },
  {
    id: 7,
    title: "Seasonal Tips",
    description: "Description for popular item 4.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727790344/1452850519201_egwhgj.jpg",
  },
  {
    id: 8,
    title: "Indoor Gardening",
    description: "Description for popular item 4.",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727790194/images_4_oup5i5.jpg",
  },
];

const premiumContent = [
  {
    id: 1,
    title: "Top 10 Fruit Trees to Grow in Your Backyard",
    description:
      "A selection of the top 10 fruit trees that can thrive in your backyard,ffering delicious and nutritious fruits throughout the year......",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728741401/images_oeawhb.jpg",
  },
  {
    id: 2,
    title: "Best Herbs to Grow Indoors Year-Round",
    description:
      "Best Herbs to Grow Indoors Year-Round.Herbs are a great way to bring....",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727790344/1452850519201_egwhgj.jpg",
  },
  {
    id: 3,
    title: "Designing a Small Garden: Space-Saving Ideas",
    description:
      "Discover space-saving ideas for designing a beautiful and functional garden, no matter how small your outdoor space is....",
    imageUrl:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728740993/garden-design-Airedale_ra0cs5.jpg",
  },
];

const users = [
  {
    id: 1,
    name: "User 1",
    avatar:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727161761/portrait-young-indian-woman-happy-with-internship-human-resources-opportunity-mission-vision-company-values-goals-face-headshot-gen-z-pe_lsoixl.avif",
  },
  {
    id: 2,
    name: "User 2",
    avatar:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727162014/images_5_oyzjjc.jpg",
  },
  {
    id: 3,
    name: "User 3",
    avatar:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1727161859/positive-mindset-positive-life-portrait-happy-young-woman-home_590464-22422_pxuwht.avif",
  },
  {
    id: 4,
    name: "User 4",
    avatar:
      "https://res.cloudinary.com/dwelabpll/image/upload/v1728742220/portrait-young-investor-banker-workplace-260nw-2364566447_pl4b4z.jpg",
  },
];

export default function Home() {
  const { user } = useUser(); // Get the user context
  const isVerified = user?.isVerified; // Check if the user is verified

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="container mx-auto flex">
        {/* Left Sidebar - Popular Content */}
        <aside className="w-1/4 p-4 bg-default-black rounded-lg">
          <h2 className="text-xl font-bold mb-4">Content Categories</h2>
          <ul className="space-y-3">
            {popularContent.map((item) => (
              <li
                key={item.id}
                className="flex items-start p-4 bg-default-black shadow-sm rounded-lg"
              >
                <img
                  alt={item.title}
                  className="w-20 h-20 rounded-md mr-4"
                  src={item.imageUrl}
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 mb-2 font-semibold">Recent Users</h3>
          <div className="flex space-x-2">
            {users.map((user) => (
              <img
                key={user.id}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white shadow"
                src={user.avatar}
                title={user.name}
              />
            ))}
          </div>
        </aside>

        {/* Middle Section - Infinite Scroll Content */}
        <main className="flex-1 mx-6 p-4 bg-default-black shadow-md rounded-lg ">
          <div className="item-center justify-center pl-52 pb-6">
            <Link passHref href="/postAction">
              <Button className="bg-purple-500 ">Go to postAction</Button>
            </Link>
          </div>
          <InfiniteScrollPosts selectedCategory={""} />
        </main>

        {/* Right Sidebar - Unlocked Premium Content */}
        <aside className="w-1/4 p-4 bg-default-black rounded-lg">
          <h2 className="text-xl font-bold mb-4">Unlocked Premium Content</h2>
          <ul className="space-y-3">
            {premiumContent.map((item) => (
              <li
                key={item.id}
                className="flex flex-col p-4 bg-default-black shadow-sm rounded-lg"
              >
                <img
                  alt={item.title}
                  className="w-full h-32 rounded-md object-cover mb-2"
                  src={item.imageUrl}
                />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </li>
            ))}
          </ul>
          <div className="pl-20">
            {/* Conditionally render the button based on verification status */}
            {isVerified ? (
              <Link passHref href="/profile/premiumContent">
                <Button className="bg-purple-500 ">See Premium Content</Button>
              </Link>
            ) : (
              <Link passHref href="/profile/verify-profile">
                <Button className="bg-purple-500 ">Unlock</Button>
              </Link>
            )}
          </div>

          <Footer />
        </aside>
      </div>
    </section>
  );
}
