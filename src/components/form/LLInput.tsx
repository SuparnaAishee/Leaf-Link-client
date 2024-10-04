"use client";


import { IInput } from "@/src/types/form";
import { Input } from "@nextui-org/input";
import { useFormContext } from "react-hook-form";

interface IProps extends IInput {}

export default function GTInput({
  variant = "bordered",
  size = "md",
  required = false,
  type = "text",
  label,
  name,
  endContent,
  startContent,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      endContent={endContent}
      startContent={startContent}
      {...register(name)}
      errorMessage={errors[name] ? (errors[name].message as string) : ""}
      isInvalid={!!errors[name]}
      variant={variant}
      size={size}
      required={required}
      type={type}
      label={label}
    />
  );
}
