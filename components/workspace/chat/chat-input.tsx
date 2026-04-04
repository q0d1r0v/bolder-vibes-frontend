"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  controls?: React.ReactNode;
}

export function ChatInput({ onSend, disabled = false, controls }: ChatInputProps) {
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
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className="border-t border-border-subtle p-4">
      <div className="max-w-2xl mx-auto">
        {disabled && (
          <div className="flex items-center justify-center gap-2 mb-2 text-xs text-accent">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span className="animate-pulse">AI is thinking...</span>
          </div>
        )}
        {controls && (
          <div className="flex items-center gap-1 mb-2 px-1">
            {controls}
          </div>
        )}
        <div className="flex items-end gap-2 bg-white rounded-2xl border border-border-subtle px-4 py-3 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={10000}
            aria-label="Message input"
            placeholder={
              disabled
                ? "AI is working..."
                : "Describe what you want to build..."
            }
            rows={3}
            className="flex-1 resize-none border-none outline-none text-sm text-text-primary placeholder:text-text-muted bg-transparent py-1"
          />
          <button
            onClick={handleSubmit}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
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
        <p className="text-xs text-text-muted mt-1.5 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
