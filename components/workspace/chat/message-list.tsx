"use client";

import { useEffect, useRef } from "react";
import { Bot, User, FilePlus, FileEdit, FileX } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { MarkdownContent } from "./markdown-content";
import type { Message } from "@/types";
import type { FileOperation } from "@/stores/chat-store";

interface MessageListProps {
  messages: Message[];
  streamingContent?: string;
  fileOperations?: FileOperation[];
}

export function MessageList({
  messages,
  streamingContent,
  fileOperations,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamingContent, fileOperations?.length]);

  if (messages.length === 0 && !streamingContent) {
    return (
      <div className="flex-1 flex items-center justify-center text-text-muted px-2">
        <div className="text-center">
          <Bot className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Start a conversation</p>
          <p className="text-xs mt-1">
            Describe what you want to build — AI can create and edit files
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {(streamingContent || (fileOperations && fileOperations.length > 0)) && (
        <div className="flex gap-2.5 flex-row">
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100">
            <Bot className="h-3.5 w-3.5 text-text-secondary" />
          </div>
          <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-gray-100 text-text-primary rounded-bl-md space-y-2">
            {fileOperations && fileOperations.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {fileOperations.map((op, i) => (
                  <FileOperationBadge key={`${op.path}-${i}`} operation={op} />
                ))}
              </div>
            )}
            {streamingContent && (
              <>
                <MarkdownContent content={streamingContent} />
                <span className="inline-block w-1.5 h-4 bg-accent/60 animate-pulse ml-0.5 -mb-0.5 rounded-sm" />
              </>
            )}
            {!streamingContent && (
              <span className="inline-block w-1.5 h-4 bg-accent/60 animate-pulse rounded-sm" />
            )}
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function FileOperationBadge({ operation }: { operation: FileOperation }) {
  const config = {
    create: {
      icon: FilePlus,
      label: "Created",
      color: "text-green-700 bg-green-50/80",
    },
    update: {
      icon: FileEdit,
      label: "Edited",
      color: "text-blue-700 bg-blue-50/80",
    },
    delete: {
      icon: FileX,
      label: "Deleted",
      color: "text-red-700 bg-red-50/80",
    },
  }[operation.type];

  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium",
        config.color
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label} <span className="font-mono opacity-75">{operation.path.split('/').pop()}</span>
    </span>
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
        {isUser ? (
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        ) : (
          <MarkdownContent content={message.content} />
        )}
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