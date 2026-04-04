"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FolderOpen,
  Pencil,
  X,
  Eye,
  EyeOff,
  MessageSquare,
  Plus,
  History,
  Rocket,
} from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/ui/logo";
import { IconButton } from "@/components/ui/icon-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FileExplorer } from "@/components/workspace/sidebar/file-explorer";
import { ConversationList } from "@/components/workspace/sidebar/conversation-list";
import { CodeEditor } from "@/components/workspace/editor/code-editor";
import { MessageList } from "@/components/workspace/chat/message-list";
import { AgentProgress } from "@/components/workspace/chat/agent-progress";
import { ChatInput } from "@/components/workspace/chat/chat-input";
import { ModelSelector } from "@/components/workspace/chat/model-selector";
import { PlanToggle } from "@/components/workspace/chat/plan-toggle";
import { PreviewPanel } from "@/components/workspace/preview/preview-panel";
import { DeployModal } from "@/components/workspace/deploy/deploy-modal";

import { useProject } from "@/hooks/queries/use-projects";
import { useFiles, useFile, useUpdateFile } from "@/hooks/queries/use-files";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useDeleteConversation,
} from "@/hooks/queries/use-conversations";
import { useProjectSocket } from "@/hooks/use-project-socket";
import { useAgentStream } from "@/hooks/use-agent-stream";
import { useChatStream } from "@/hooks/use-chat-stream";
import { useEditorStore } from "@/stores/editor-store";
import { useAgentStore } from "@/stores/agent-store";
import { useChatStore } from "@/stores/chat-store";
import { useResize, useResizeInverted } from "@/hooks/use-resize";
import { ROUTES } from "@/lib/constants";
import type { ProjectFile } from "@/types";

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

  const [showFiles, setShowFiles] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showConversations, setShowConversations] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [activeConvId, setActiveConvId] = usePersistedConvId(projectId);
  const [previewRefreshSignal, setPreviewRefreshSignal] = useState(0);

  // Resizable panels
  const filesSidebar = useResize({ direction: "horizontal", initialSize: 220, minSize: 160, maxSize: 360 });
  const previewPanel = useResizeInverted({ direction: "horizontal", initialSize: 480, minSize: 320, maxSize: 800 });

  // Data fetching
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: files = [] } = useFiles(projectId);
  const { data: conversationsData } = useConversations(projectId);
  const conversations = conversationsData?.data || [];
  const currentActiveConvId = activeConvId;
  const { data: activeConversation } = useConversation(currentActiveConvId || "");
  const createConversation = useCreateConversation(projectId);
  const deleteConversation = useDeleteConversation(projectId);

  // Real-time
  useProjectSocket(projectId);
  useAgentStream();
  const { sendMessage: sendSocketMessage, streamingContent, streamingConversationId, fileOperations } = useChatStream(projectId);
  const chatIsStreaming = useChatStore((s) => s.isStreaming);

  // Editor state (for edit dialog)
  const {
    openTabs,
    unsavedChanges,
    openFile,
    setUnsavedContent,
    clearUnsaved,
    updateFileContent,
    reset,
  } = useEditorStore();

  const isRunning = useAgentStore((s) => s.isRunning);
  const isCreatingConvRef = useRef(false);
  const updateFile = useUpdateFile(projectId);

  // Fetch file detail when editing
  const { data: fileDetail } = useFile(projectId, editingFileId || "");
  useEffect(() => {
    if (fileDetail && fileDetail.content !== undefined) {
      updateFileContent(fileDetail.id, fileDetail.content);
    }
  }, [fileDetail, updateFileContent]);

  // Auto-refresh preview when chat AI creates/edits files
  const prevFileOpsLenRef = useRef(0);
  useEffect(() => {
    if (fileOperations.length > prevFileOpsLenRef.current) {
      prevFileOpsLenRef.current = fileOperations.length;
      const timer = setTimeout(() => setPreviewRefreshSignal((s) => s + 1), 1500);
      return () => clearTimeout(timer);
    }
    if (fileOperations.length === 0) prevFileOpsLenRef.current = 0;
  }, [fileOperations.length]);

  // Find editing file from open tabs
  const currentFileIds = new Set(files.map((f) => f.id));
  const projectOpenTabs = openTabs.filter((tab) => currentFileIds.has(tab.id));
  const editingFile = editingFileId
    ? projectOpenTabs.find((tab) => tab.id === editingFileId) || null
    : null;

  useEffect(() => { reset(); }, [projectId, reset]);

  // Open file in editor dialog
  const handleFileSelect = useCallback(
    (file: ProjectFile) => {
      openFile(file);
      setEditingFileId(file.id);
    },
    [openFile]
  );

  const handleEditorChange = useCallback(
    (fileId: string, content: string) => setUnsavedContent(fileId, content),
    [setUnsavedContent]
  );

  const handleEditorSave = useCallback(
    (fileId: string, content: string) => {
      updateFile.mutate(
        { fileId, data: { content, message: "Manual edit" } },
        {
          onSuccess: () => {
            clearUnsaved(fileId);
            updateFileContent(fileId, content);
            toast.success("File saved");
            setPreviewRefreshSignal((s) => s + 1);
          },
        }
      );
    },
    [updateFile, clearUnsaved, updateFileContent]
  );

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
        <div className="h-12 border-b border-border-subtle bg-white flex items-center px-3 gap-3">
          <div className="h-6 w-6 rounded bg-gray-100 animate-pulse" />
          <div className="h-5 w-24 rounded bg-gray-100 animate-pulse" />
          <div className="h-5 w-px bg-border-subtle" />
          <div className="h-5 w-32 rounded bg-gray-100 animate-pulse" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md space-y-3 px-6">
            {[80, 60, 90, 50, 70].map((w, i) => (
              <div key={i} className="h-4 rounded bg-gray-200 animate-pulse" style={{ width: `${w}%` }} />
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

  // ─── Main Layout: Chat (center) + Preview (right) ───────
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <header className="h-12 border-b border-border-subtle bg-white flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-3">
          <IconButton size="sm" aria-label="Back" onClick={() => router.push(ROUTES.DASHBOARD)}>
            <ArrowLeft className="h-4 w-4" />
          </IconButton>
          <Logo size="sm" />
          <div className="h-5 w-px bg-border-subtle" />
          <span className="text-sm font-medium text-text-primary">{project.name}</span>
          <Badge variant={project.status === "ACTIVE" ? "success" : "outline"}>
            {project.status}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            size="sm"
            aria-label={showFiles ? "Hide files" : "Show files"}
            onClick={() => setShowFiles(!showFiles)}
            className={showFiles ? "bg-accent-soft/50 text-accent" : ""}
            title="Files"
          >
            <FolderOpen className="h-4 w-4" />
          </IconButton>
          <IconButton
            size="sm"
            aria-label={showPreview ? "Hide preview" : "Show preview"}
            onClick={() => setShowPreview(!showPreview)}
            className={showPreview ? "bg-accent-soft/50 text-accent" : ""}
            title="Preview"
          >
            {showPreview ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </IconButton>
          {!isArchived && (
            <Button
              size="sm"
              onClick={() => setShowDeploy(true)}
              className="ml-2 gap-1.5"
            >
              <Rocket className="h-3.5 w-3.5" />
              Deploy
            </Button>
          )}
        </div>
      </header>

      {isArchived && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-center shrink-0">
          <p className="text-xs text-amber-700 font-medium">
            This project is archived. You can view the history but cannot make changes.
          </p>
        </div>
      )}

      {/* ── Content: Files? | Chat | Preview? ──────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Files sidebar (collapsible) */}
        {showFiles && (
          <>
            <aside
              className="border-r border-border-subtle bg-white flex flex-col shrink-0 overflow-hidden"
              style={{ width: filesSidebar.size }}
            >
              <div className="flex-1 overflow-y-auto py-2">
                <div className="px-3 py-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Files</span>
                  <span className="text-xs text-text-muted">{files.length}</span>
                </div>
                <FileExplorer
                  files={files}
                  selectedFileId={editingFileId}
                  onFileSelect={handleFileSelect}
                />
              </div>
            </aside>
            <div
              className="w-1 shrink-0 cursor-col-resize hover:bg-accent/20 active:bg-accent/30 transition-colors"
              onMouseDown={filesSidebar.handleMouseDown}
            />
          </>
        )}

        {/* ── AI Chat (center, flex-1) ─────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Chat header */}
          <div className="border-b border-border-subtle">
            <div className="px-4 py-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text-primary truncate">
                {activeConversation?.title || (currentActiveConvId ? "Untitled Chat" : "New Chat")}
              </h2>
              <div className="flex items-center gap-1 shrink-0">
                {!isArchived && (
                  <IconButton
                    size="sm"
                    aria-label="New chat"
                    onClick={handleCreateConversation}
                    disabled={createConversation.isPending}
                    title="New Chat"
                  >
                    <Plus className="h-4 w-4" />
                  </IconButton>
                )}
                <IconButton
                  size="sm"
                  aria-label="Chat history"
                  onClick={() => setShowConversations(true)}
                  title="Chat History"
                >
                  <History className="h-4 w-4" />
                </IconButton>
              </div>
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
          />

          <AgentProgress />

          {/* Input */}
          {!isArchived && (
            <ChatInput
              onSend={handleSendMessage}
              disabled={isRunning || chatIsStreaming || createConversation.isPending}
              controls={
                <>
                  <PlanToggle />
                  <ModelSelector />
                </>
              }
            />
          )}
        </div>

        {/* ── Preview (right side) ──────────────────────────── */}
        {showPreview && (
          <>
            <div
              className="w-1 shrink-0 cursor-col-resize hover:bg-accent/20 active:bg-accent/30 transition-colors"
              onMouseDown={previewPanel.handleMouseDown}
            />
            <div
              className="shrink-0 overflow-hidden border-l border-border-subtle"
              style={{ width: previewPanel.size }}
            >
              <PreviewPanel projectId={projectId} refreshSignal={previewRefreshSignal} isArchived={isArchived} />
            </div>
          </>
        )}
      </div>

      {/* ── Conversations Dialog (overlay) ─────────────────── */}
      {showConversations && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowConversations(false); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[60vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-gray-50">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-text-primary">Conversations</span>
              </div>
              <IconButton size="sm" aria-label="Close" onClick={() => setShowConversations(false)}>
                <X className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                conversations={conversations}
                activeId={currentActiveConvId}
                onSelect={(id) => { setActiveConvId(id); setShowConversations(false); }}
                onCreate={isArchived ? undefined : () => { handleCreateConversation(); setShowConversations(false); }}
                onDelete={handleDeleteConversation}
                deleteLoading={deleteConversation.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {showDeploy && (
        <DeployModal
          projectId={projectId}
          projectName={project.name}
          onClose={() => setShowDeploy(false)}
        />
      )}

      {/* ── Edit File Dialog (overlay) ──────────────────────── */}
      {editingFileId && editingFile && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setEditingFileId(null); }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-gray-50">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-text-primary">{editingFile.path}</span>
              </div>
              <div className="flex items-center gap-2">
                {!isArchived && (
                  <Button
                    size="sm"
                    onClick={() => {
                      const content = unsavedChanges[editingFileId] ?? editingFile.content;
                      handleEditorSave(editingFileId, content);
                    }}
                    disabled={!unsavedChanges[editingFileId]}
                  >
                    Save
                  </Button>
                )}
                <IconButton size="sm" aria-label="Close" onClick={() => setEditingFileId(null)}>
                  <X className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <CodeEditor
                file={editingFile}
                unsavedContent={isArchived ? undefined : unsavedChanges[editingFileId]}
                onChange={handleEditorChange}
                onSave={handleEditorSave}
                readOnly={isArchived}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
