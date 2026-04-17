"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  PanelRightOpen,
  PanelRightClose,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";

import { ConversationsDialog } from "@/components/workspace/sidebar/conversations-dialog";
import { MessageList } from "@/components/workspace/chat/message-list";
import { AgentProgress } from "@/components/workspace/chat/agent-progress";
import { ChatInput } from "@/components/workspace/chat/chat-input";
import { ModelSelector } from "@/components/workspace/chat/model-selector";
import { PlanToggle } from "@/components/workspace/chat/plan-toggle";
import { PreviewPanel } from "@/components/workspace/preview/preview-panel";

import { useProject } from "@/hooks/queries/use-projects";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useDeleteConversation,
} from "@/hooks/queries/use-conversations";
import { useProjectSocket } from "@/hooks/use-project-socket";
import { useAgentStream } from "@/hooks/use-agent-stream";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useSocketStore } from "@/stores/socket-store";
import { useQueryClient } from "@tanstack/react-query";
import { useAgentStore } from "@/stores/agent-store";
import { useChatStore } from "@/stores/chat-store";
import { useResizeInverted } from "@/hooks/use-resize";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  PENDING_PROMPT_KEY,
  PENDING_PLAN_MODE_KEY,
} from "@/lib/prompt-generator";

// Persist active conversation ID per project across refresh
function usePersistedConvId(projectId: string) {
  const key = `bv-active-conv:${projectId}`;
  const [id, setIdRaw] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(key) || null;
  });

  const setId = useCallback(
    (newId: string | null) => {
      setIdRaw(newId);
      if (typeof window === "undefined") return;
      if (newId) {
        sessionStorage.setItem(key, newId);
      } else {
        sessionStorage.removeItem(key);
      }
    },
    [key]
  );

  return [id, setId] as const;
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [showPreview, setShowPreview] = useState(true);
  const [showConversations, setShowConversations] = useState(false);
  const [activeConvId, setActiveConvId] = usePersistedConvId(projectId);
  const [previewRefreshSignal, setPreviewRefreshSignal] = useState(0);
  const [pendingPrompt, setPendingPrompt] = useState<string | undefined>(undefined);
  const setPlanMode = useChatStore((s) => s.setPlanMode);

  useEffect(() => {
    if (typeof window === "undefined" || !projectId) return;
    try {
      const prompt = sessionStorage.getItem(PENDING_PROMPT_KEY(projectId));
      const wantPlan = sessionStorage.getItem(PENDING_PLAN_MODE_KEY(projectId));
      if (prompt) {
        setPendingPrompt(prompt);
        sessionStorage.removeItem(PENDING_PROMPT_KEY(projectId));
      }
      if (wantPlan === "1") {
        setPlanMode(true);
        sessionStorage.removeItem(PENDING_PLAN_MODE_KEY(projectId));
      }
    } catch {
      // ignore storage errors
    }
  }, [projectId, setPlanMode]);

  // Resizable preview panel
  const previewPanel = useResizeInverted({ direction: "horizontal", initialSize: 420, minSize: 320, maxSize: 600 });

  // Data fetching
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: conversationsData } = useConversations(projectId);
  const conversations = conversationsData?.data || [];
  const currentActiveConvId = activeConvId;
  const { data: activeConversation } = useConversation(currentActiveConvId || "");
  const createConversation = useCreateConversation(projectId);
  const deleteConversation = useDeleteConversation(projectId);

  // Real-time
  useProjectSocket(projectId);
  useAgentStream();

  // Socket connection state — surfaces a banner if the WS drops so
  // users know chat responses won't stream until the reconnect lands.
  const isSocketConnected = useSocketStore((s) => s.isConnected);
  const queryClient = useQueryClient();
  // Catch-up refetch: when the socket reconnects after being down, any
  // `chat:response_end` events we missed would leave the conversation
  // view stale. Invalidate the cached conversations so React Query
  // pulls fresh data over HTTP.
  const wasConnectedRef = useRef(isSocketConnected);
  useEffect(() => {
    if (!wasConnectedRef.current && isSocketConnected) {
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
    wasConnectedRef.current = isSocketConnected;
  }, [isSocketConnected, queryClient]);
  const {
    sendMessage: sendSocketMessage,
    stopMessage: stopSocketMessage,
    streamingContent,
    streamingConversationId,
    fileOperations,
  } = useChatStream();
  const chatIsStreaming = useChatStore((s) => s.isStreaming);

  const isRunning = useAgentStore((s) => s.isRunning);
  const isCreatingConvRef = useRef(false);

  // Soft-refresh the preview iframe after a file-touching chat turn.
  //
  // Path we rely on for live updates:
  //   chat tool call → DB write → PreviewService.syncFile writes into
  //   the running container's bind-mounted workDir → Metro's file
  //   watcher (polling, see preview.interface.ts) fires Fast Refresh
  //   on the connected iframe/Expo Go client. That's pure HMR — no
  //   container restart, no state loss.
  //
  // As a belt-and-braces fallback, once the stream ends with at least
  // one file op we bump `refreshSignal`. PreviewPanel debounces and
  // does a single iframe remount — cheap, and covers the case where
  // HMR missed a change (watcher lag, new file that wasn't imported
  // yet, etc.). We do NOT restart the container here; the manual
  // Rebuild toolbar button is available for that.
  const wasStreamingRef = useRef(false);
  const fileOpsAtStreamStartRef = useRef(0);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (chatIsStreaming && !wasStreamingRef.current) {
      wasStreamingRef.current = true;
      fileOpsAtStreamStartRef.current = fileOperations.length;
      return;
    }
    if (!chatIsStreaming && wasStreamingRef.current) {
      wasStreamingRef.current = false;
      const fileOpsDuringStream =
        fileOperations.length - fileOpsAtStreamStartRef.current;
      if (fileOpsDuringStream <= 0) return;

      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = setTimeout(() => {
        refreshTimerRef.current = null;
        setPreviewRefreshSignal((s) => s + 1);
      }, 900);
    }
  }, [chatIsStreaming, fileOperations.length]);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  const handleCreateConversation = useCallback(() => {
    createConversation.mutate(undefined, {
      onSuccess: (conv) => setActiveConvId(conv.id),
    });
  }, [createConversation, setActiveConvId]);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      deleteConversation.mutate(id, {
        onSuccess: () => {
          if (currentActiveConvId === id) setActiveConvId(null);
        },
      });
    },
    [deleteConversation, currentActiveConvId, setActiveConvId]
  );

  const handleStopMessage = useCallback(() => {
    if (!currentActiveConvId) return;
    stopSocketMessage(currentActiveConvId);
  }, [currentActiveConvId, stopSocketMessage]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!currentActiveConvId) {
        if (isCreatingConvRef.current) return;
        isCreatingConvRef.current = true;
        createConversation.mutate(undefined, {
          onSuccess: async (conv) => {
            setActiveConvId(conv.id);
            await sendSocketMessage(conv.id, content);
          },
          onError: () => toast.error("Failed to create conversation. Please try again."),
          onSettled: () => { isCreatingConvRef.current = false; },
        });
        return;
      }
      await sendSocketMessage(currentActiveConvId, content);
    },
    [currentActiveConvId, createConversation, sendSocketMessage, setActiveConvId]
  );

  // ─── Loading / Not Found ────────────────────────────────
  if (projectLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="h-12 border-b border-border-subtle bg-white/[0.04] flex items-center px-3 gap-3">
          <div className="h-6 w-6 rounded bg-white/[0.06] animate-pulse" />
          <div className="h-5 w-24 rounded bg-white/[0.06] animate-pulse" />
          <div className="h-5 w-px bg-border-subtle" />
          <div className="h-5 w-32 rounded bg-white/[0.06] animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-white/[0.03]">
          <div className="w-full max-w-md space-y-3 px-6">
            {[80, 60, 90, 50, 70].map((w, i) => (
              <div key={i} className="h-4 rounded bg-white/[0.08] animate-pulse" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-text-muted">Project not found</p>
      </div>
    );
  }

  const isArchived = project.status === "ARCHIVED";

  // ─── Main Layout: Chat (left) + Mobile Preview (right) ──
  return (
    <div className="h-screen flex flex-col bg-white/[0.03]">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="h-14 border-b border-border-subtle bg-white/[0.04] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 -ml-2 text-xs text-text-secondary hover:text-text-primary hover:bg-white/[0.05] transition-colors shrink-0 whitespace-nowrap"
            aria-label="Back to projects"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Projects</span>
          </button>
          <div className="h-5 w-px bg-border-subtle shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-text-primary truncate">
              {project.name}
            </span>
            <Badge
              variant={project.status === "ACTIVE" ? "success" : "outline"}
              className="text-[10px] shrink-0"
            >
              {project.status === "ACTIVE" ? "Active" : project.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              showPreview
                ? "bg-accent/15 text-accent hover:bg-accent/20"
                : "text-text-secondary hover:bg-white/[0.06] hover:text-text-primary",
            )}
            title={showPreview ? "Hide preview" : "Show preview"}
            aria-pressed={showPreview}
          >
            {showPreview ? (
              <PanelRightClose className="h-3.5 w-3.5" />
            ) : (
              <PanelRightOpen className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>
      </header>

      {isArchived && (
        <div className="px-4 py-2 bg-amber-500/15 border-b border-amber-500/30 text-center shrink-0">
          <p className="text-xs text-amber-400 font-medium">
            This project is archived. You can view the history but cannot make changes.
          </p>
        </div>
      )}

      {!isSocketConnected && (
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-amber-500/15 border-b border-amber-500/30 shrink-0">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-[11px] text-amber-300 font-medium">
            Reconnecting to server… chat replies will resume automatically.
          </p>
        </div>
      )}

      {/* ── Content: Chat | Preview ─────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── AI Chat (left, flex-1) ──────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white/[0.04]">
          {/* Chat header — compact: title button hugs its content on the
              left, "+ New" button sits next to it. The whole row is
              short so it doesn't feel stretched across the chat column. */}
          <div className="border-b border-border-subtle">
            <div className="px-3 py-1.5 flex items-center gap-1">
              <button
                onClick={() => setShowConversations(true)}
                className="group inline-flex items-center gap-2 max-w-full min-w-0 rounded-md px-2 py-1 hover:bg-white/[0.05] transition-colors text-left"
                title={
                  conversations.length > 0
                    ? `${conversations.length} conversation${
                        conversations.length === 1 ? "" : "s"
                      } — click to switch`
                    : "Start a new chat"
                }
              >
                <MessageSquare className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span className="text-sm font-medium text-text-primary truncate">
                  {activeConversation?.title ||
                    (currentActiveConvId ? "Untitled chat" : "New chat")}
                </span>
                {conversations.length > 0 && (
                  <span className="shrink-0 text-[10px] text-text-muted rounded-full bg-white/[0.05] px-1.5 py-0.5 leading-none">
                    {conversations.length}
                  </span>
                )}
                <ChevronDown className="h-3 w-3 text-text-muted shrink-0 transition-transform group-hover:translate-y-0.5" />
              </button>
              {!isArchived && (
                <button
                  onClick={handleCreateConversation}
                  disabled={createConversation.isPending}
                  className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-text-secondary hover:bg-white/[0.06] hover:text-text-primary transition-colors disabled:opacity-50"
                  title="Start a new chat"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">New</span>
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <MessageList
            messages={activeConversation?.messages || []}
            streamingContent={
              streamingConversationId === currentActiveConvId ? streamingContent : undefined
            }
            fileOperations={
              streamingConversationId === currentActiveConvId ? fileOperations : undefined
            }
            onPickSuggestion={
              isArchived ? undefined : (prompt) => setPendingPrompt(prompt)
            }
          />

          <AgentProgress />

          {/* Input */}
          {!isArchived && (
            <ChatInput
              onSend={handleSendMessage}
              onStop={handleStopMessage}
              isStreaming={chatIsStreaming && streamingConversationId === currentActiveConvId}
              disabled={isRunning || chatIsStreaming || createConversation.isPending}
              initialValue={pendingPrompt}
              controls={
                <>
                  <PlanToggle />
                  <ModelSelector />
                </>
              }
            />
          )}
        </div>

        {/* ── Mobile Preview (right side) ──────────────────── */}
        <div
          className={cn(
            "shrink-0 cursor-col-resize hover:bg-accent/20 active:bg-accent/30 transition-colors",
            showPreview ? "w-1" : "hidden"
          )}
          onMouseDown={previewPanel.handleMouseDown}
        />
        <div
          className={cn(
            "shrink-0 overflow-hidden border-l border-border-subtle",
            showPreview ? "" : "hidden"
          )}
          style={{ width: previewPanel.size }}
        >
          <PreviewPanel
            projectId={projectId}
            refreshSignal={previewRefreshSignal}
            isArchived={isArchived}
          />
        </div>
      </div>

      {/* ── Conversations Dialog (overlay) ─────────────────── */}
      <ConversationsDialog
        open={showConversations}
        conversations={conversations}
        activeId={currentActiveConvId}
        onClose={() => setShowConversations(false)}
        onSelect={(id) => {
          setActiveConvId(id);
          setShowConversations(false);
        }}
        onCreate={
          isArchived
            ? undefined
            : () => {
                handleCreateConversation();
                setShowConversations(false);
              }
        }
        onDelete={handleDeleteConversation}
        deleteLoading={deleteConversation.isPending}
      />
    </div>
  );
}
