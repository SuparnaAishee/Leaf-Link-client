import { TPost } from "./post";

export interface IUser {
  _id: string;
  name: string;
  role: string;
  email: string;
  status: string;
  mobileNumber: string;
  profilePhoto: string;
  isVerified: boolean;
  premiumStatus: boolean;
  followers: IUser[];
  following: IUser[];
  posts: string[];
  favorites: TPost[];
  createdAt: string;
  updatedAt: string;
  iat: number;
  exp: number;
  __v: number;
}

export interface IUpdateUserData {
  id: string;
  data: {
    role?: "USER" | "ADMIN";
    status?: "ACTIVE" | "BLOCKED";
  };
}

export type TUpdateType = "USER" | "ADMIN" | "ACTIVE" | "BLOCKED";

export interface IUserStats {
  userStats: UserStats;
  postStats: PostStats;
  verifiedUserStats: VerifiedUserStats;
}

export interface UserStats {
  totalUsers: number;
  todayUsers: number;
  lastSevenDaysUsers: number;
  lastMonthUsers: number;
}

export interface PostStats {
  totalPosts: number;
  todayPosts: number;
  lastSevenDaysPosts: number;
  lastMonthPosts: number;
}

export interface VerifiedUserStats {
  totalVerifiedUsers: number;
  todayVerifiedUsers: number;
  lastSevenDaysVerifiedUsers: number;
  lastMonthVerifiedUsers: number;
  totalVerifiedUserPayments: number;
}
