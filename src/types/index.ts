export * from "./form";
export * from "./user";
export * from "./post";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface IResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error: any;
}
