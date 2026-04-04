"use client";

import { ListChecks } from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { cn } from "@/lib/utils";

export function PlanToggle() {
  const { planMode, setPlanMode } = useChatStore();

  return (
    <button
      onClick={() => setPlanMode(!planMode)}
      title={planMode ? "Plan Mode ON — AI will plan first, then you approve" : "Plan Mode OFF — AI will edit files directly"}
      className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors",
        planMode
          ? "bg-amber-100 text-amber-700 border border-amber-300"
          : "text-text-muted hover:bg-gray-100"
      )}
    >
      <ListChecks className="h-3 w-3" />
      <span className="font-medium">Plan</span>
    </button>
  );
}
