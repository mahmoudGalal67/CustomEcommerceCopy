"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetChatQuery, useMarkALLMessagesIsreadForAdminMutation, useCloseChatChatMutation, useSendAdminMessageMutation, useOpenChatMutation, useMarkMessageIsreadMutation } from "@/services/ChatsApi";
import { SendHorizonal, Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { initEcho } from "@/lib/bootstrap";

const ChatMessagesPage = ({
  params,
}: {
  params: Promise<{ id: number }>;
}) => {
  const { id } = React.use(params);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const {
    data: messages,
    isLoading,
    isError,
  } = useGetChatQuery({ id },{refetchOnMountOrArgChange: true});
  const [sendMeessage] = useSendAdminMessageMutation();
  const [markAllAdminMessagesRead] = useMarkALLMessagesIsreadForAdminMutation();
    const [MarkMessageIsreadMutation] = useMarkMessageIsreadMutation();

  const [closeChat] = useCloseChatChatMutation();
  const [openChat] = useOpenChatMutation();

  const [message, setMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [localMessages]);

  useEffect(() => {
    if (messages) {
      setLocalMessages(messages);
    }
  }, [messages]);


  useEffect(() => {
    markAllAdminMessagesRead({ chat_id: id })
    closeChat({ chat_id: id })

    return () => {
      openChat({ chat_id: id })
    }

  }, [])


  
  useEffect(() => {
    if (!id) return;

    const echo = initEcho();

    const channel = echo.channel(`chat.${id}`);

    channel.listen(".message.sent", (e: any) => {
      if (e.sender == 'admin') return
      setLocalMessages((prev) => [...prev, { ...e }]);
       MarkMessageIsreadMutation({ message_id: e.id })
      
      console.log(e)
    });
    return () => {
      echo.leave(`chat.${id}`);
    };
  }, [id]);


  const handleSend = async () => {
    if (!message.trim()) return;

    const tempId = Date.now();

    const optimisticMessage = {
      id: tempId,
      chat_id: id,
      sender: "admin",
      message,
      created_at: new Date().toISOString(),
      pending: true,
    };

    // SAVE OLD STATE
    const previousMessages = [...localMessages];

    // UPDATE UI IMMEDIATELY
    setLocalMessages((prev) => [
      ...prev,
      optimisticMessage,
    ]);

    // CLEAR INPUT
    setMessage("");

    try {
      const res: any = await sendMeessage({
        message,
        chat_id: id,
      }).unwrap();

      // REPLACE TEMP MESSAGE
      setLocalMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? res
            : msg
        )
      );

    } catch (error) {

      // ROLLBACK IF FAILED
      setLocalMessages(previousMessages);

      console.log(error);
    }
  };
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading messages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error loading messages.
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-muted/30  min-h-[85vh]">

      {/* Header */}
      <div className="border-b  px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold">
            Support Chat #{id}
          </h1>

          <p className="text-sm text-muted-foreground">
            Real-time customer support
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>

            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </div>

          <span className="text-sm text-muted-foreground">
            Active
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="max-w-7xl mx-auto space-y-6 ">

          {localMessages?.map((msg: any) => {
            const isUser = msg.sender === "user";
            const isAI = msg.sender === "ai";
            const isAdmin = msg.sender === "admin";

            return (
              <div
                key={msg.id}
                className={clsx(
                  "flex gap-3",
                  isUser
                    ? "justify-start"
                    : "justify-end"
                )}
              >
                {/* Avatar LEFT */}
                {isUser && (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-black text-white">
                      <User size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}

                {/* Bubble */}
                <div
                  className={clsx(
                    "max-w-[75%] rounded-3xl px-5 py-4 shadow-sm transition-all",
                    isUser &&
                    "bg-white border text-black rounded-bl-md",

                    isAI &&
                    "bg-blue-500 text-white rounded-br-md",

                    isAdmin &&
                    "bg-green-500 text-white rounded-br-md"
                  )}
                >
                  {/* Sender */}
                  <div className="flex items-center gap-2 mb-2">

                    {isAI && <Bot size={16} />}
                    {isAdmin && <User size={16} />}

                    <span className="text-xs font-semibold opacity-80 uppercase tracking-wide">
                      {isUser
                        ? "Customer"
                        : isAI
                          ? "AI Assistant"
                          : "Support Agent"}
                    </span>
                  </div>

                  {/* Message */}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>

                  {/* Time */}
                  <div
                    className={clsx(
                      "text-[11px] mt-3",
                      isUser
                        ? "text-muted-foreground"
                        : "text-white/70"
                    )}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Avatar RIGHT */}
                {!isUser && (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className={clsx(
                        isAI
                          ? "bg-blue-500 text-white"
                          : "bg-green-500 text-white"
                      )}
                    >
                      {isAI ? (
                        <Bot size={18} />
                      ) : (
                        <User size={18} />
                      )}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t  p-4">
        <div className="max-w-5xl mx-auto flex gap-3">

          <Input
            placeholder="Type your reply..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-12 rounded-2xl"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSend();
              }
            }}
          />

          <Button
            onClick={handleSend}
            className="h-12 px-6 rounded-2xl"
          >
            <SendHorizonal size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatMessagesPage;