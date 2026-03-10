"use client";

import { X } from "lucide-react";
import { cn, getFileName, getFileExtension } from "@/lib/utils";
import type { ProjectFile } from "@/types";

interface TabBarProps {
  tabs: ProjectFile[];
  activeFileId: string | null;
  unsavedChanges: Record<string, string>;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
}

export function TabBar({
  tabs,
  activeFileId,
  unsavedChanges,
  onSelectTab,
  onCloseTab,
}: TabBarProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center bg-gray-50 border-b border-border-subtle overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeFileId;
        const isUnsaved = tab.id in unsavedChanges;

        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm cursor-pointer border-r border-border-subtle min-w-0 group",
              isActive
                ? "bg-white text-text-primary border-b-2 border-b-accent"
                : "text-text-secondary hover:bg-gray-100"
            )}
          >
            <span className="truncate max-w-[120px]">
              {getFileName(tab.path)}
            </span>

            {isUnsaved && (
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
              className="p-0.5 rounded hover:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
