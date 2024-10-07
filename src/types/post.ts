// Define the structure of a post
export type TPost = {
  likes: any;
  username: string;
  _id: string; // or use string | undefined if it might not be set
  title: string;
  description: string;
  user: {
    name: string;
    profilePhoto: string;
  };
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
  _id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  mobileNumber: string;
  profilePhoto?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface IUpdateVote {
  voteType: "upvote" | "downvote";
  userId: string;
  postId: string;
}