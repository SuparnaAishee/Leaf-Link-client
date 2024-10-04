import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, "Password must be at least 6 character"),
});

export const changePasswordValidationSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, "Password must be at least 6 character"),
  confirmNewPassword: z
    .string()
    .min(6, "Password must be at least 6 character"),
});
