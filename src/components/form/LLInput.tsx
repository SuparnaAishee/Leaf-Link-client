"use client";

import { Input } from "@nextui-org/input";
import { useFormContext } from "react-hook-form";

interface IProps {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  readOnly?: boolean;
  disabled?: boolean;
}

export default function LLInput({
  variant = "bordered",
  size = "md",
  required = false,
  type = "text",
  label,
  name,
  readonly,
  disabled,
}: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      {...register(name)}
      disabled={disabled}
      errorMessage={errors[name] ? (errors[name].message as string) : ""}
      isInvalid={!!errors[name]}
      label={label}
      readOnly={readonly}
      required={required}
      size={size}
      type={type}
      variant={variant}
    />
  );
}
