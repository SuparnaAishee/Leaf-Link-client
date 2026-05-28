import { TPost } from "./post";
import { IUser } from "./user";

export interface ICommentPayload {
  comment: string;
  post: string;
  user: string;
  parentComment?: string | null;
}
export interface IComment {
  comment: string;
  post: TPost;
  user: IUser;
  postUser: IUser;
  parentComment?: string | null;
  createdAt?: string;
  _id: string;
}
