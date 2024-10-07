"use client";

import { IInput } from "@/src/types/form";
import { Textarea } from "@nextui-org/input";
import { useFormContext, useWatch } from "react-hook-form";


interface IProps extends IInput {
  type?: string;
}

export default function LLTextarea({
  name,
  label,
  variant = "bordered",
}: IProps) {
  const { register } = useFormContext();
  const currentValue = useWatch({ name });
  return (
    <Textarea
      {...register(name)}
      label={label}
      minRows={6}
      variant={variant}
      value={currentValue || ""}
    />
  );
}
