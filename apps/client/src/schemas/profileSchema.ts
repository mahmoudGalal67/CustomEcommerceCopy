// schemas/profileSchema.ts

import { z } from "zod";

export const profileSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name is required"),

    email: z
      .string()
      .email("Invalid email"),

    password: z
      .string()
      .optional(),

    confirmPassword: z
      .string()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.password) return true;

      return data.password === data.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type ProfileFormValues =
  z.infer<typeof profileSchema>;