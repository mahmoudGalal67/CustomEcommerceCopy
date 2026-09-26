import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z.string().min(1, "Please confirm password"),
    is_seller: z.boolean(),
    phone: z.string().optional(),
    store_name: z.string().optional(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  })
  .refine(
    (data) => {
      if (data.is_seller) {
        return !!data.store_name?.trim() && !!data.phone?.trim();
      }

      return true;
    },
    {
      message: "Store name and phone are required for sellers ",
      path: ["store_name"],
    },
  );

export const loginSchema = z.object({
  email: z.email().min(1, "email is required"),
  password: z.string().min(1, "password is required"),
});
