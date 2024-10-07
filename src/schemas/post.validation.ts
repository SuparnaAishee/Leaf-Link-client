import { z } from "zod";

const postValidationSchema = z.object({
  title: z.string().min(1, "Title is required"), // Title must be a non-empty string
  category: z.string().min(1, "Category is required"), // Category must be a non-empty string
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"), // Description must be at least 10 characters
  isPremium: z.boolean().optional(), // isPremium is optional and should be a boolean
  image: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "An image file is required"), // Ensure an image file is provided
});

export default postValidationSchema;
