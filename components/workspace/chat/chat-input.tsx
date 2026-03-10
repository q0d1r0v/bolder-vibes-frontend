"use client";

import { useState, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  return (
    <div className="border-t border-border-subtle p-3">
      <div className="flex items-end gap-2 bg-white rounded-2xl border border-border-subtle px-4 py-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={
            disabled
              ? "AI is working..."
              : "Describe what you want to build..."
          }
          rows={1}
          className="flex-1 resize-none border-none outline-none text-sm text-text-primary placeholder:text-text-muted bg-transparent py-1"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            "p-2 rounded-full transition-colors flex-shrink-0",
            value.trim() && !disabled
              ? "bg-accent text-white hover:bg-accent/90"
              : "text-text-muted"
          )}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-text-muted mt-1.5 px-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
