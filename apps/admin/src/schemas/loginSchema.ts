import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "password is required"),
});



export interface UserInfo {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'seller' | 'client';
}
