import { IUser } from "./user";

export interface IPaymentHistory {
  _id: string;
  user: IUser;
  date: string;
  amount: number;
  isDeleted: boolean;
  transactionId: string;
  isPaid: boolean;
  __v: number;
}
