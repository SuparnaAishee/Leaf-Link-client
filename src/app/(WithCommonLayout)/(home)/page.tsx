// import InfiniteScrollPosts from "@/src/components/post/newsfeedpost";



// export default function Home() {
//   return (
//     <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
//       <div><InfiniteScrollPosts selectedCategory={""}/></div>
//     </section>
//   );
// }

// Home.tsx
import InfiniteScrollPosts from "@/src/components/post/newsfeedpost";
import Footer from "@/src/components/UI/Footer";

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
    title: "Premium Item 1",
    description: "Description for premium item 1.",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    id: 2,
    title: "Premium Item 2",
    description: "Description for premium item 2.",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
  {
    id: 3,
    title: "Premium Item 3",
    description: "Description for premium item 2.",
    imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
  },
];

const users = [
  { id: 1, name: "User 1", avatar: "https://via.placeholder.com/50" },
  { id: 2, name: "User 2", avatar: "https://via.placeholder.com/50" },
  { id: 3, name: "User 3", avatar: "https://via.placeholder.com/50" },
  { id: 4, name: "User 4", avatar: "https://via.placeholder.com/50" },
];

export default function Home() {
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
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 rounded-md mr-4"
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
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-white shadow"
                title={user.name}
              />
            ))}
          </div>
        </aside>

        {/* Middle Section - Infinite Scroll Content */}
        <main className="flex-1 mx-6 p-4 bg-default-black shadow-md rounded-lg ">
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
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-32 rounded-md object-cover mb-2"
                />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </li>
            ))}
          </ul>
          <Footer />
        </aside>
      </div>
    </section>
  );
}
