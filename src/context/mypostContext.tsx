// context/PostsContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface PostsContextType {
  posts: any[]; // Replace 'any' with a more specific type if you have a Post type
  fetchPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | null>(null); // Initialize context with a type

interface PostsProviderProps {
  children: ReactNode; // Define the type for children
}

export const PostsProvider: React.FC<PostsProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<any[]>([]); // Replace 'any' with a more specific type if you have a Post type

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when component mounts
  }, []);

  return (
    <PostsContext.Provider value={{ posts, fetchPosts }}>
      {children}
    </PostsContext.Provider>
  );
};

// Create a custom hook for easier access
export const usePosts = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};
