// Define the structure of a post
export type TPost = {
  _id: string; // or use string | undefined if it might not be set
  title: string;
  description: string;
  user: string; // Assuming user ID is a string in the frontend
  imageUrl?: string; // optional
  category: string;
  tags?: string[]; // optional
  isPremium: boolean;
  upvotes: string[]; // Array of user IDs or any other identifier for upvotes
  downvotes: string[]; // Array of user IDs or any other identifier for downvotes
  comments: string[]; // Array of comment IDs
  createdAt: string; // Consider using ISO string format for dates
  updatedAt: string; // Consider using ISO string format for dates
};

export type TUser = {
  _id: string; // or whatever ID type you are using
  name: string;
  profilePicture?: string; // Optional, in case the user has no profile picture
};