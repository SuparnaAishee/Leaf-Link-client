import { TPost } from "./post";
import { IUser } from "./user";

export interface ICommentPayload {
  comment: string;
  post: string;
  user: string;
}
export interface IComment {
  comment: string;
  post: TPost;
  user: IUser;
  postUser: IUser;
  _id: string;
}
