"use client";

import { Input } from "@nextui-org/input";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

interface IProps {
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  type?: string;
  label: string;
  name: string;
  readonly?: boolean;
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

  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const effectiveType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <Input
      {...register(name)}
      disabled={disabled}
      errorMessage={
        errors[name]?.message ? (errors[name]?.message as string) : ""
      }
      isInvalid={!!errors[name]}
      label={label}
      readOnly={readonly}
      required={required}
      size={size}
      type={effectiveType}
      variant={variant}
      endContent={
        isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="focus:outline-none text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        ) : undefined
      }
    />
  );
}
