"use client";

import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingBubble from "./TypingBubble";
function ChatWindow({
  messages,
  message,
  setmessage,
  onSend,
  onClose,
  isTyping,
  dict,
}: {
  messages: {
    id: number;
    chat_id: number;
    message: string;
    sender: "user" | "ai" | "admin";
    status: "answered" | "pending";
    is_read?: boolean;
  }[];
  message: string;
  setmessage: (value: string) => void;
  onSend: () => void;
  onClose: () => void;
  isTyping: boolean;
  dict: any;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);
  return (
    <div className="absolute z-100 bottom-20 right-0 w-[320px] h-[520px]  md:w-[380px] md:h-[570px] rounded-3xl border border-gray-200 bg-white  shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
      <ChatHeader onClose={onClose} dict={dict} />

      <div className="h-[370px]  md:h-[420px] overflow-y-auto px-4 py-4 space-y-4 bg-gray-50 dark:bg-gray-800">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg.message}
            isUser={msg.sender === "user"}
          />
        ))}
        {isTyping && <TypingBubble dict={dict} />}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={message}
        onChange={setmessage}
        onSend={onSend}
        dict={dict}
      />
    </div>
  );
}

export default ChatWindow;
