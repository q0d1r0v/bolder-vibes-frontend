"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Zap, Brain, Sparkles } from "lucide-react";
import { useAiModels } from "@/hooks/queries/use-conversations";
import { useChatStore } from "@/stores/chat-store";
import { cn } from "@/lib/utils";

const costIcons = {
  low: Zap,
  medium: Sparkles,
  high: Brain,
} as const;

const costColors = {
  low: "text-green-400",
  medium: "text-blue-400",
  high: "text-purple-400",
} as const;

export function ModelSelector() {
  const { data: models = [] } = useAiModels();
  const { selectedModel, setSelectedModel } = useChatStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = models.find((m) => m.id === selectedModel) || models[0];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!current) return null;

  const Icon = costIcons[current.costTier];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs hover:bg-white/[0.08] transition-colors"
      >
        <Icon className={cn("h-3 w-3", costColors[current.costTier])} />
        <span className="text-text-secondary font-medium">{current.name}</span>
        <ChevronDown className="h-3 w-3 text-text-muted" />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-1 w-72 bg-[#1a1a24] backdrop-blur-xl rounded-lg shadow-lg border border-white/10 z-50 py-1">
          {models.map((model) => {
            const ModelIcon = costIcons[model.costTier];
            const isActive = model.id === selectedModel;

            return (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 hover:bg-white/[0.06] transition-colors",
                  isActive && "bg-accent-soft/30"
                )}
              >
                <div className="flex items-center gap-2">
                  <ModelIcon
                    className={cn("h-3.5 w-3.5", costColors[model.costTier])}
                  />
                  <span className="text-sm font-medium text-text-primary">
                    {model.name}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-xs text-accent font-medium">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-0.5 ml-5.5">
                  {model.description}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
