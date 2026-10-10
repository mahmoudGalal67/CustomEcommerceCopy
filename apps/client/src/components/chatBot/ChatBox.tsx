"use client";

import { useEffect, useRef, useState } from "react";

import ChatWindow from "./ChatWindow";
import {
  useGetMessagesMutation,
  useMarkALLMessagesIsreadForUserMutation,
  useMarkMessageIsreadMutation,
  useSendMssageMutation,
} from "@/services/chatService";
import { getGuestToken } from "@/lib/getGuestToken";
import { initEcho } from "@/lib/bootstrap";

type ChatMessage = {
  id: number;
  chat_id: number;
  message: string;
  sender: "user" | "ai" | "admin";
  status: "answered" | "pending";
  is_read?: boolean;
};

export default function ChatBox({ dict }: { dict: any }) {
  const [sendMessage] = useSendMssageMutation();
  const [isTyping, setIsTyping] = useState(false);
  const [getMessages] = useGetMessagesMutation();
  const [MarkMessageIsreadMutation] = useMarkMessageIsreadMutation();
  const [MarkALLMessagesIsreadForUserMutation] =
    useMarkALLMessagesIsreadForUserMutation();

  const guestToken = getGuestToken();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setmessage] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      chat_id: 0,
      message: dict.Chat.message,
      sender: "ai",
      status: "answered",
      is_read: true,
    },
  ]);
  const unreadCount = messages.filter(
    (msg: any) => msg.sender !== "user" && msg.is_read === 0,
  ).length;
  const isOpenRef = useRef(false);
  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!chatId) return;
    const echo = initEcho();

    const channel = echo.channel(`chat.${chatId}`);

    channel.listen(".message.sent", (e: any) => {
      console.log(e);
      if (e.sender == "user") return;
      if (!isOpenRef.current) {
        setMessages((prev) => [...prev, { ...e }]);
      } else {
        MarkMessageIsreadMutation({ message_id: e.id });
        setMessages((prev) => [...prev, { ...e, is_read: true }]);
      }
    });
    return () => {
      echo.leave(`chat.${chatId}`);
    };
  }, [chatId, isOpen]);

  useEffect(() => {
    const loadMessages = async () => {
      const res = await getMessages({
        guest_token: guestToken,
      }).unwrap();
      if (res) {
        setChatId(res[0].chat_id);
      }
      setMessages(res);
    };
    loadMessages();
  }, []);

  const handleSend = async () => {
    try {
      if (!message) {
        return;
      }
      setmessage("");
      setIsTyping(true);
      setMessages((prev: any) => [
        ...prev,
        {
          ...prev[prev.length - 1],
          message,
          sender: "user",
          id: prev[prev.length - 1]?.id + 1,
        },
      ]);
      const res: any = await sendMessage({ message, guest_token: guestToken });
      // setChatId(res.data.message.chat_id);
      setIsTyping(false);
      // setMessages((prev: any) => [...prev, res.data.message])
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="fixed bottom-6 right-6 z-9" ref={chatRef}>
      {unreadCount > 0 && (
        <span className="absolute -top-1 z-[10000] -right-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white ring-2 ring-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
      {unreadCount > 0 && (
        <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-30" />
      )}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) {
            setMessages((prev: any) =>
              prev.map((msg: any) => {
                if (msg.sender != "user" && !msg.is_read) {
                  return { ...msg, is_read: true };
                } else {
                  return msg;
                }
              }),
            );
            MarkALLMessagesIsreadForUserMutation({ chat_id: chatId });
          }
        }}
        className={`group h-16 w-16 rounded-full bg-black dark:bg-gray-600 text-white shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer ${unreadCount > 0 ? "animate-chat-shake" : ""}`}
      >
        <svg
          className={`h-7 w-7 transition-all duration-300 ${
            isOpen ? "rotate-180 scale-90" : "group-hover:rotate-12"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z"
          />
        </svg>
      </button>

      {isOpen && (
        <ChatWindow
          messages={messages}
          message={message}
          setmessage={setmessage}
          onSend={handleSend}
          onClose={() => setIsOpen(false)}
          isTyping={isTyping}
          dict={dict.Chat}
        />
      )}
    </div>
  );
}
