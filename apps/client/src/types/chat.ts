export type Message = {
  id: number;
  message: string;
  sender: "user" | "ai" | "admin";
  created_at?: string;
};