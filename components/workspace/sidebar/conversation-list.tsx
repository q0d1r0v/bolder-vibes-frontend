"use client";

import { useState } from "react";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Conversation } from "@/types";

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate?: () => void;
  onDelete: (id: string) => void;
  deleteLoading?: boolean;
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  deleteLoading = false,
}: ConversationListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);

  const handleDeleteClick = (e: React.MouseEvent, conv: Conversation) => {
    e.stopPropagation();
    setDeleteTarget(conv);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          Conversations
        </span>
        {onCreate && (
          <IconButton size="sm" onClick={onCreate}>
            <Plus className="h-4 w-4" />
          </IconButton>
        )}
      </div>

      <div className="space-y-0.5 px-1">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors group",
              activeId === conv.id
                ? "bg-accent-soft/50 text-accent"
                : "hover:bg-black/[0.04] text-text-primary"
            )}
          >
            <MessageSquare className="h-4 w-4 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">
                {conv.title || "Untitled"}
              </p>
              <p className="text-xs text-text-muted">
                {formatRelativeTime(conv.updatedAt)}
              </p>
            </div>
            {conv._count?.messages && (
              <span className="text-xs text-text-muted group-hover:hidden">
                {conv._count.messages}
              </span>
            )}
            <span
              role="button"
              tabIndex={0}
              className="hidden group-hover:flex items-center text-text-muted hover:text-danger"
              onClick={(e) => handleDeleteClick(e, conv)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleDeleteClick(e as unknown as React.MouseEvent, conv);
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </span>
          </button>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete conversation"
        description={`Are you sure you want to delete "${deleteTarget?.title || "Untitled"}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        danger
      />
    </div>
  );
}
