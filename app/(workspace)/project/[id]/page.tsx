"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, PanelRightClose, PanelRightOpen, History } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/ui/logo";
import { IconButton } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

import { FileExplorer } from "@/components/workspace/sidebar/file-explorer";
import { ConversationList } from "@/components/workspace/sidebar/conversation-list";
import { TabBar } from "@/components/workspace/editor/tab-bar";
import { CodeEditor } from "@/components/workspace/editor/code-editor";
import { VersionHistory } from "@/components/workspace/editor/version-history";
import { MessageList } from "@/components/workspace/chat/message-list";
import { AgentProgress } from "@/components/workspace/chat/agent-progress";
import { ChatInput } from "@/components/workspace/chat/chat-input";
import { PreviewPanel } from "@/components/workspace/preview/preview-panel";

import { useProject } from "@/hooks/queries/use-projects";
import { useFiles, useFile, useUpdateFile } from "@/hooks/queries/use-files";
import {
  useConversations,
  useConversation,
  useCreateConversation,
  useDeleteConversation,
  useSendMessage,
} from "@/hooks/queries/use-conversations";
import { useProjectSocket } from "@/hooks/use-project-socket";
import { useAgentStream } from "@/hooks/use-agent-stream";
import { useEditorStore } from "@/stores/editor-store";
import { useAgentStore } from "@/stores/agent-store";
import { ROUTES } from "@/lib/constants";
import type { ProjectFile } from "@/types";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [showChat, setShowChat] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);

  // Data fetching
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: files = [] } = useFiles(projectId);
  const { data: conversationsData } = useConversations(projectId);
  const conversations = conversationsData?.data || [];
  const currentActiveConvId = conversations.some((conversation) => conversation.id === activeConvId)
    ? activeConvId
    : null;
  const { data: activeConversation } = useConversation(currentActiveConvId || "");
  const createConversation = useCreateConversation(projectId);
  const deleteConversation = useDeleteConversation(projectId);
  const sendMessageMutation = useSendMessage();

  // Real-time
  useProjectSocket(projectId);
  useAgentStream();

  // Editor state
  const {
    activeFileId,
    openTabs,
    unsavedChanges,
    openFile,
    closeTab,
    setActiveFile,
    setUnsavedContent,
    clearUnsaved,
    updateFileContent,
    reset,
  } = useEditorStore();

  const { isRunning } = useAgentStore();

  const updateFile = useUpdateFile(projectId);

  // Fetch full file content when a file is selected (list endpoint may omit content)
  const { data: fileDetail } = useFile(projectId, activeFileId || '');

  useEffect(() => {
    if (fileDetail && fileDetail.content !== undefined) {
      updateFileContent(fileDetail.id, fileDetail.content);
    }
  }, [fileDetail, updateFileContent]);

  const currentFileIds = new Set(files.map((file) => file.id));
  const projectOpenTabs = openTabs.filter((tab) => currentFileIds.has(tab.id));
  const activeFile =
    projectOpenTabs.find((tab) => tab.id === activeFileId) || null;
  const projectActiveFileId = activeFile?.id || null;

  useEffect(() => {
    reset();
  }, [projectId, reset]);

  const handleFileSelect = useCallback(
    (file: ProjectFile) => {
      openFile(file);
    },
    [openFile]
  );

  const handleEditorChange = useCallback(
    (fileId: string, content: string) => {
      setUnsavedContent(fileId, content);
    },
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
  }, [createConversation]);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      deleteConversation.mutate(id, {
        onSuccess: () => {
          if (currentActiveConvId === id) {
            setActiveConvId(null);
          }
        },
      });
    },
    [deleteConversation, currentActiveConvId]
  );

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!currentActiveConvId) {
        createConversation.mutate(undefined, {
          onSuccess: (conv) => {
            setActiveConvId(conv.id);
            sendMessageMutation.mutate({
              conversationId: conv.id,
              data: { content },
            });
          },
        });
        return;
      }
      sendMessageMutation.mutate({
        conversationId: currentActiveConvId,
        data: { content },
      });
    },
    [currentActiveConvId, createConversation, sendMessageMutation]
  );

  if (projectLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
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

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <header className="h-12 border-b border-border-subtle bg-white flex items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <IconButton
            size="sm"
            onClick={() => router.push(ROUTES.DASHBOARD)}
          >
            <ArrowLeft className="h-4 w-4" />
          </IconButton>
          <Logo size="sm" />
          <div className="h-5 w-px bg-border-subtle" />
          <span className="text-sm font-medium text-text-primary">
            {project.name}
          </span>
          <Badge variant={project.status === "ACTIVE" ? "success" : "outline"}>
            {project.status}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className={showHistory ? "bg-accent-soft/50 text-accent" : ""}
          >
            <History className="h-4 w-4" />
          </IconButton>
          <IconButton
            size="sm"
            onClick={() => setShowChat(!showChat)}
          >
            {showChat ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </IconButton>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 border-r border-border-subtle bg-white flex flex-col flex-shrink-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto py-2">
            <div className="px-3 py-1.5">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
                Files
              </span>
            </div>
            <FileExplorer
              files={files}
              selectedFileId={projectActiveFileId}
              onFileSelect={handleFileSelect}
            />
          </div>

          <div className="border-t border-border-subtle overflow-y-auto max-h-[40%]">
            <ConversationList
              conversations={conversations}
              activeId={currentActiveConvId}
              onSelect={setActiveConvId}
              onCreate={handleCreateConversation}
              onDelete={handleDeleteConversation}
              deleteLoading={deleteConversation.isPending}
            />
          </div>
        </aside>

        {/* Editor + Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <TabBar
              tabs={projectOpenTabs}
              activeFileId={projectActiveFileId}
              unsavedChanges={unsavedChanges}
              onSelectTab={setActiveFile}
              onCloseTab={closeTab}
            />

            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <CodeEditor
                  file={activeFile}
                  unsavedContent={
                    projectActiveFileId
                      ? unsavedChanges[projectActiveFileId]
                      : undefined
                  }
                  onChange={handleEditorChange}
                  onSave={handleEditorSave}
                  readOnly={isRunning}
                />
              </div>

              {showHistory && projectActiveFileId && (
                <div className="w-64 border-l border-border-subtle bg-white overflow-y-auto flex-shrink-0">
                  <VersionHistory
                    projectId={projectId}
                    fileId={projectActiveFileId}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="h-[35%] border-t border-border-subtle flex-shrink-0">
            <PreviewPanel projectId={projectId} />
          </div>
        </div>

        {/* Chat Panel */}
        {showChat && (
          <aside className="w-[350px] border-l border-border-subtle bg-white flex flex-col flex-shrink-0">
            <div className="px-4 py-3 border-b border-border-subtle">
              <h2 className="text-sm font-semibold text-text-primary">
                AI Chat
              </h2>
            </div>

            <MessageList
              messages={activeConversation?.messages || []}
            />

            <AgentProgress />

            <ChatInput
              onSend={handleSendMessage}
              disabled={isRunning}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
