// components/chatBot/ChatBoxLazy.tsx
"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { AppDictionary } from "@/types/types";

const ChatBox = dynamic(() => import("./ChatBox"), { ssr: false });

export default function ChatBoxLazy({ dict }: { dict: AppDictionary }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(() => setReady(true), { timeout: 5000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(() => setReady(true), 3000);
    return () => clearTimeout(t);
  }, []);
  return ready ? <ChatBox dict={dict} /> : null;
}
