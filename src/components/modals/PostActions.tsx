/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { TPost } from "@/src/types";
import handleCopyPostURL from "@/src/utils/handleCopyPostURL";

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";

import { MoreVerticalIcon } from "lucide-react";
import { Options } from "react-to-pdf";

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
        <DropdownItem onClick={() => handleCopyPostURL(post?._id)} key="copy">
          Copy Link
        </DropdownItem>
        <DropdownItem onClick={() => toPDF()} key="pdf">
          Generate PDF
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
