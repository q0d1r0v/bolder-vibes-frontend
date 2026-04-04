"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  ExternalLink,
  Monitor,
  Tablet,
  Smartphone,
  Play,
  Square,
  Terminal,
  Eye,
} from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  usePreviewStatus,
  useStartPreview,
  useStopPreview,
} from "@/hooks/queries/use-sandbox";
import { usePreviewCleanup } from "@/hooks/use-preview-cleanup";
import { PreviewLogs } from "./preview-logs";
import { cn } from "@/lib/utils";

type DeviceSize = "desktop" | "tablet" | "mobile";
type PanelTab = "preview" | "logs";

const deviceWidths: Record<DeviceSize, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

interface PreviewPanelProps {
  projectId: string;
  refreshSignal?: number;
  isArchived?: boolean;
}

export function PreviewPanel({ projectId, refreshSignal, isArchived }: PreviewPanelProps) {
  const { data: status } = usePreviewStatus(projectId);
  const startPreview = useStartPreview(projectId);
  const stopPreview = useStopPreview(projectId);

  const [device, setDevice] = useState<DeviceSize>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<PanelTab>("preview");
  const [previewSrc, setPreviewSrc] = useState<string>("");

  // Use the raw container URL directly — the path-prefix proxy approach
  // doesn't work because dev servers (Vite, Next.js) serve assets with
  // root-relative paths (/@vite/client, /src/main.tsx) that can't be
  // routed through a /api/v1/projects/:id/preview/* prefix.
  const previewUrl = status?.url ?? null;
  const isBuilding = status?.status === "building";
  const hasError = status?.status === "error";
  const isReady = status?.status === "ready";
  const isIdle = !status || status.status === "idle";

  // Auto-stop Docker container on navigation away or tab close
  usePreviewCleanup(projectId, status?.status);

  // Set iframe src when preview becomes ready
  useEffect(() => {
    setPreviewSrc(previewUrl ?? "");
  }, [previewUrl, refreshKey]);

  // Auto-refresh iframe when parent signals a file save
  useEffect(() => {
    if (refreshSignal && refreshSignal > 0) {
      setRefreshKey((k) => k + 1);
    }
  }, [refreshSignal]);

  // Auto-switch to logs tab when building starts, preview tab when ready
  useEffect(() => {
    if (status?.status === "building") {
      setActiveTab("logs");
    } else if (status?.status === "ready") {
      setActiveTab("preview");
    }
  }, [status?.status]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-gray-50">
        {/* Left: Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border border-border-subtle bg-white overflow-hidden">
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs transition-colors",
                activeTab === "preview"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-gray-100"
              )}
            >
              <Eye className="h-3 w-3" />
              Preview
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 text-xs transition-colors",
                activeTab === "logs"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-gray-100"
              )}
            >
              <Terminal className="h-3 w-3" />
              Logs
            </button>
          </div>

          {activeTab === "preview" && (
            <div className="flex items-center gap-0.5 ml-1">
              <IconButton
                size="sm"
                onClick={() => setDevice("desktop")}
                className={cn(device === "desktop" && "bg-black/[0.06]")}
              >
                <Monitor className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                size="sm"
                onClick={() => setDevice("tablet")}
                className={cn(device === "tablet" && "bg-black/[0.06]")}
              >
                <Tablet className="h-3.5 w-3.5" />
              </IconButton>
              <IconButton
                size="sm"
                onClick={() => setDevice("mobile")}
                className={cn(device === "mobile" && "bg-black/[0.06]")}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </IconButton>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {(isIdle || hasError) && !isArchived && (
            <IconButton
              size="sm"
              onClick={() => startPreview.mutate()}
              disabled={startPreview.isPending}
              title="Start Preview"
            >
              <Play className="h-3.5 w-3.5" />
            </IconButton>
          )}
          {(isBuilding || isReady) && !isArchived && (
            <IconButton
              size="sm"
              onClick={() => stopPreview.mutate()}
              disabled={stopPreview.isPending}
              title="Stop Preview"
            >
              <Square className="h-3.5 w-3.5" />
            </IconButton>
          )}
          {activeTab === "preview" && (
            <>
              <IconButton
                size="sm"
                onClick={() => setRefreshKey((k) => k + 1)}
                disabled={!previewUrl}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </IconButton>
              {previewUrl && (
                <IconButton
                  size="sm"
                  onClick={() => window.open(previewUrl, "_blank")}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </IconButton>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      {/* Logs always mounted to preserve state; shown when active OR building */}
      <div className={activeTab === "logs" || isBuilding ? "flex-1 min-h-0 overflow-hidden flex flex-col" : "hidden"}>
        {isBuilding && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/5 border-b border-accent/10 shrink-0">
            <Spinner size="sm" />
            <span className="text-xs text-accent font-medium">Building preview...</span>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-hidden">
          <PreviewLogs projectId={projectId} />
        </div>
      </div>
      <div className={activeTab === "preview" && !isBuilding ? "flex-1 min-h-0 bg-gray-100 overflow-hidden relative" : "hidden"}>
        {hasError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-6">
              <p className="text-sm text-danger font-medium">Build Error</p>
              <p className="text-xs text-text-muted mt-1 max-w-sm">
                {status?.error || "An error occurred during the build."}
              </p>
              {!isArchived && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => startPreview.mutate()}
                  loading={startPreview.isPending}
                >
                  <Play className="h-3.5 w-3.5" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        ) : previewSrc ? (
          <iframe
            key={refreshKey}
            src={previewSrc}
            className="bg-white border-0 absolute inset-0"
            style={{
              width: deviceWidths[device],
              height: "100%",
              maxWidth: "100%",
              margin: device !== "desktop" ? "0 auto" : undefined,
            }}
            title="Preview"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-text-muted">No preview available</p>
              <p className="text-xs text-text-muted mt-1">
                Start a preview to see your app running
              </p>
              {!isArchived && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => startPreview.mutate()}
                  loading={startPreview.isPending}
                >
                  <Play className="h-3.5 w-3.5" />
                  Start Preview
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
