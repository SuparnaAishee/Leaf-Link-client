
// import { useEffect, useState } from "react";

// export default function Categories({ posts, onSelectCategory }) {
//   const [categories, setCategories] = useState<string[]>([]);

//   useEffect(() => {
//     // Extract unique categories from posts
//     const uniqueCategories = [...new Set(posts.map((post: { category: any; }) => post.category))];
//     setCategories(uniqueCategories);
//   }, [posts]);

//   return (
//     <div>
//       <h2 className="text-lg font-bold mb-4">Categories</h2>
//       <ul>
//         {categories.map((category) => (
//           <li
//             key={category}
//             className="py-2 cursor-pointer"
//             onClick={() => onSelectCategory(category)}
//           >
//             {category}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// /components/CategorySection.tsx
interface CategorySectionProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void; // Function to set the selected category
}

export default function CategorySection({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategorySectionProps) {
  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h3 className="text-lg font-bold mb-4">Categories</h3>

      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category}>
            <button
              className={`${
                selectedCategory === category
                  ? "font-bold text-green-500"
                  : "text-blue-500"
              } hover:underline`}
              onClick={() => setSelectedCategory(category)} // Set the selected category when clicked
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
