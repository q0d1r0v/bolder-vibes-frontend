"use client";

import { useEffect, useRef } from "react";
import {
  Bot,
  User,
  FilePlus,
  FileEdit,
  FileX,
  Sparkles,
  Palette,
  Bell,
  LogIn,
  Camera,
  Map,
} from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { MarkdownContent } from "./markdown-content";
import type { Message } from "@/types";
import type { FileOperation } from "@/stores/chat-store";

interface MessageListProps {
  messages: Message[];
  streamingContent?: string;
  fileOperations?: FileOperation[];
  /** Called when a user clicks one of the empty-state suggestion chips. */
  onPickSuggestion?: (prompt: string) => void;
}

/** Bite-sized prompts shown when a conversation is brand new. They give
 *  non-technical users a starting nudge instead of staring at an empty
 *  "describe what you want" box. Each chip writes a full sentence into
 *  the chat input so the AI receives proper context. */
const SUGGESTIONS: Array<{
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  prompt: string;
  tint: string;
}> = [
  {
    icon: Palette,
    label: "Change colors",
    prompt: "Update the app's color theme to a warm orange and cream palette.",
    tint: "#f97316",
  },
  {
    icon: LogIn,
    label: "Add login",
    prompt:
      "Add a simple email + password login screen with a sign-up link.",
    tint: "#8b5cf6",
  },
  {
    icon: Bell,
    label: "Add notifications",
    prompt:
      "Add a notifications page that shows a list of alerts with read / unread state.",
    tint: "#14b8a6",
  },
  {
    icon: Camera,
    label: "Add profile page",
    prompt:
      "Add a profile screen with an avatar, name, bio and an edit button.",
    tint: "#3b82f6",
  },
  {
    icon: Map,
    label: "Add a map",
    prompt:
      "Add a map screen that shows a pin on the user's current location.",
    tint: "#22c55e",
  },
];

export function MessageList({
  messages,
  streamingContent,
  fileOperations,
  onPickSuggestion,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamingContent, fileOperations?.length]);

  if (messages.length === 0 && !streamingContent) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/25 to-accent/10 border border-accent/20 mx-auto flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h3 className="text-base font-semibold text-text-primary">
            What do you want to build?
          </h3>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Describe your idea in plain language — the AI will design,
            build, and preview it live.
          </p>

          <div className="flex flex-wrap justify-center gap-1.5 mt-5">
            {SUGGESTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => onPickSuggestion?.(s.prompt)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] transition-colors px-2.5 py-1 text-[11px] text-text-secondary hover:text-text-primary"
                >
                  <Icon className="h-3 w-3" style={{ color: s.tint }} />
                  {s.label}
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-text-muted mt-5">
            Tip: be specific. &ldquo;Add a red Save button to the top right&rdquo; works
            better than &ldquo;make it look nicer&rdquo;.
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
          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-white/[0.06]">
            <Bot className="h-3.5 w-3.5 text-text-secondary" />
          </div>
          <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm bg-white/[0.06] text-text-primary rounded-bl-md space-y-2">
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
      color: "text-green-400 bg-green-500/15",
    },
    update: {
      icon: FileEdit,
      label: "Edited",
      color: "text-blue-400 bg-blue-500/15",
    },
    delete: {
      icon: FileX,
      label: "Deleted",
      color: "text-red-400 bg-red-500/15",
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
          isUser ? "bg-accent" : "bg-white/[0.06]"
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
            : "bg-white/[0.06] text-text-primary rounded-bl-md"
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