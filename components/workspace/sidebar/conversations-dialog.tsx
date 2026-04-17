"use client";

import { useMemo, useState } from "react";
import { MessageSquare, Plus, Search, Trash2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Conversation } from "@/types";

interface ConversationsDialogProps {
  open: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate?: () => void;
  onDelete: (id: string) => void;
  deleteLoading?: boolean;
}

export function ConversationsDialog({
  open,
  onClose,
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  deleteLoading = false,
}: ConversationsDialogProps) {
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Conversation | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      (c.title || "Untitled").toLowerCase().includes(q),
    );
  }, [conversations, query]);

  const hasConversations = conversations.length > 0;

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setQuery("");
          onClose();
        }}
        title="Your chats"
        description="Pick a chat to continue or start a new one."
        className="max-w-xl"
      >
        <div className="space-y-3">
          {/* Toolbar: search + new chat */}
          {hasConversations && (
            <div className="flex items-center gap-2">
              <SearchInput
                placeholder="Search chats..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                containerClassName="flex-1"
                className="h-9"
              />
              {onCreate && (
                <Button
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    onCreate();
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  New chat
                </Button>
              )}
            </div>
          )}

          {/* List / empty states */}
          {!hasConversations ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/25 flex items-center justify-center mb-3">
                <MessageSquare className="h-5 w-5 text-accent" />
              </div>
              <p className="text-sm font-medium text-text-primary">
                No conversations yet
              </p>
              <p className="text-xs text-text-muted mt-1 max-w-xs">
                Describe what you want to build and we&apos;ll kick off your
                first chat with the AI.
              </p>
              {onCreate && (
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setQuery("");
                    onCreate();
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Start your first chat
                </Button>
              )}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-10 text-center">
              <Search className="h-5 w-5 text-text-muted mx-auto mb-2" />
              <p className="text-xs text-text-muted">
                No conversations match &ldquo;{query}&rdquo;.
              </p>
            </div>
          ) : (
            <ul className="max-h-[52vh] overflow-y-auto -mx-1 pr-1 space-y-1.5">
              {filtered.map((conv) => {
                const isActive = conv.id === activeId;
                const messages = conv._count?.messages ?? 0;
                return (
                  <li key={conv.id}>
                    <div
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors",
                        isActive
                          ? "bg-accent/15 border-accent/40"
                          : "bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15]",
                      )}
                      onClick={() => {
                        setQuery("");
                        onSelect(conv.id);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setQuery("");
                          onSelect(conv.id);
                        }
                      }}
                    >
                      {/* Active accent dot */}
                      {isActive && (
                        <span className="absolute -left-[3px] top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-accent" />
                      )}

                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                          isActive
                            ? "bg-accent/20 text-accent"
                            : "bg-white/[0.05] text-text-secondary",
                        )}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm truncate",
                            isActive
                              ? "text-text-primary font-medium"
                              : "text-text-primary",
                          )}
                        >
                          {conv.title || "Untitled chat"}
                        </p>
                        <p className="text-[11px] text-text-muted mt-0.5">
                          {messages > 0
                            ? `${messages} message${messages === 1 ? "" : "s"} · `
                            : ""}
                          {formatRelativeTime(conv.updatedAt)}
                        </p>
                      </div>

                      <button
                        type="button"
                        aria-label="Delete chat"
                        title="Delete chat"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteTarget(conv);
                        }}
                        className="shrink-0 inline-flex items-center justify-center h-7 w-7 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete chat"
        description={`Delete "${
          deleteTarget?.title || "Untitled chat"
        }"? This can't be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        danger
      />
    </>
  );
}
