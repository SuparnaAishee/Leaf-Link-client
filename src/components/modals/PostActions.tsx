/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/dropdown";
import { MoreVerticalIcon } from "lucide-react";
import { Options } from "react-to-pdf";

import handleCopyPostURL from "@/src/utils/handleCopyPostURL";
import { TPost } from "@/src/types";

interface IProps {
  post: TPost;
  toPDF: (options?: Options) => void;
}

export default function PostActions({ post, toPDF }: IProps) {
  return (
    <Dropdown>
      <DropdownTrigger>
        <MoreVerticalIcon cursor="pointer" />
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="copy" onClick={() => handleCopyPostURL(post?._id)}>
          Copy Link
        </DropdownItem>
        <DropdownItem key="pdf" onClick={() => toPDF()}>
          Generate PDF
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
