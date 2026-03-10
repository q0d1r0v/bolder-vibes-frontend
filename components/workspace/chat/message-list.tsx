"use client";

import { useEffect, useRef } from "react";
import { Bot, User } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Message } from "@/types";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted">
        <div className="text-center">
          <Bot className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Start a conversation</p>
          <p className="text-xs mt-1">Describe what you want to build</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.role === "SYSTEM") {
    return (
      <div className="text-center">
        <p className="text-xs text-text-muted italic">{message.content}</p>
      </div>
    );
  }

  const isUser = message.role === "USER";

  return (
    <div
      className={cn(
        "flex gap-2.5",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
          isUser ? "bg-accent" : "bg-gray-100"
        )}
      >
        {isUser ? (
          <User className="h-3.5 w-3.5 text-white" />
        ) : (
          <Bot className="h-3.5 w-3.5 text-text-secondary" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "bg-accent text-white rounded-br-md"
            : "bg-gray-100 text-text-primary rounded-bl-md"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <p
          className={cn(
            "text-xs mt-1",
            isUser ? "text-white/60" : "text-text-muted"
          )}
        >
          {formatRelativeTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
