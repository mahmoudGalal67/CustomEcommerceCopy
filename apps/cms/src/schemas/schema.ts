import { z } from "zod";

export const loginSchema = z.object({
    email: z.email().min(1, "email is required"),
    password: z.string().min(1, "password is required"),
});
