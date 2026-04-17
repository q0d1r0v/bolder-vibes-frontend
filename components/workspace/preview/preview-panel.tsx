"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  Terminal,
  Smartphone,
  ChevronDown,
  Monitor,
  TabletSmartphone,
  Package,
  QrCode,
  RotateCcw,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { downloadProjectSource } from "@/lib/api/projects.api";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  usePreviewStatus,
  useStartPreview,
  useStopPreview,
  useRestartPreview,
} from "@/hooks/queries/use-sandbox";
import { usePreviewCleanup } from "@/hooks/use-preview-cleanup";
import { PreviewLogs } from "./preview-logs";
import { DeviceFrame } from "./device-frame";
import { useApkBuild } from "@/hooks/use-apk-build";
import {
  DEVICE_PRESETS,
  loadDeviceId,
  saveDeviceId,
  getPreset,
  type DeviceGroup,
} from "./device-presets";
import { ApkBuildDialog } from "./apk-build-dialog";
import { PhonePreviewDialog } from "./phone-preview-dialog";
import { useNativePreview } from "@/hooks/use-native-preview";
import { cn } from "@/lib/utils";

type PanelTab = "preview" | "logs";

interface PreviewPanelProps {
  projectId: string;
  refreshSignal?: number;
  isArchived?: boolean;
  /** True while the workspace is auto-restarting the preview container
   *  after an AI edit. Merges with the backend's own `building` state
   *  so the user sees a single continuous "Building preview…" banner. */
  isRebuilding?: boolean;
}

export function PreviewPanel({
  projectId,
  refreshSignal,
  isArchived,
  isRebuilding,
}: PreviewPanelProps) {
  const { data: status } = usePreviewStatus(projectId);
  const startPreview = useStartPreview(projectId);
  const stopPreview = useStopPreview(projectId);
  const restartPreview = useRestartPreview(projectId);

  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<PanelTab>("preview");
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [deviceId, setDeviceId] = useState(loadDeviceId);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const deviceMenuRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [apkDialogOpen, setApkDialogOpen] = useState(false);
  const [phoneDialogOpen, setPhoneDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadSource = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const { filename } = await downloadProjectSource(projectId);
      toast.success(`Downloaded ${filename}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to download source code",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Surface APK build lifecycle *outside* the dialog so users who close
  // it still see whether a build is running / finished / errored.
  const { status: apkStatus } = useApkBuild(projectId);
  const isApkBuilding = apkStatus === "building";

  // Same surfacing for the "scan on phone" tunnel — a tiny status dot
  // on the QR button tells users something is running without them
  // having to re-open the dialog.
  const { status: phoneStatus } = useNativePreview(projectId);
  const isPhoneStarting = phoneStatus === "building";
  const isPhoneReady = phoneStatus === "ready";

  const selectedDevice = getPreset(deviceId);

  const handleDeviceChange = (id: string) => {
    setDeviceId(id);
    saveDeviceId(id);
    setShowDeviceMenu(false);
  };

  // Close device menu on outside click
  useEffect(() => {
    if (!showDeviceMenu) return;
    const handler = (e: MouseEvent) => {
      if (deviceMenuRef.current && !deviceMenuRef.current.contains(e.target as Node)) {
        setShowDeviceMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDeviceMenu]);

  const previewUrl = status?.url ?? null;
  // `isRebuilding` from the parent (auto-restart in flight) OR the
  // backend having flipped status to BUILDING both count as "currently
  // rebuilding" for UI purposes — the banner + tab switch should fire
  // in either case so there's no dead gap between the mutation kicking
  // off and the backend's status catching up.
  const isBuilding = status?.status === "building" || !!isRebuilding;
  const hasError = status?.status === "error";
  const isReady = status?.status === "ready";
  const isIdle = !status || status.status === "idle";

  // Auto-stop Docker container on navigation away or tab close
  usePreviewCleanup(projectId, status?.status);

  // Set iframe src only when preview is fully ready. We load the
  // Metro dev server directly on its Docker-mapped port — this is the
  // rock-solid path that was battle-tested before any proxy changes.
  useEffect(() => {
    if (isReady && previewUrl) {
      setIframeLoaded(false);
      setPreviewSrc(previewUrl);
    } else if (isIdle || hasError) {
      setPreviewSrc("");
      setIframeLoaded(false);
    }
  }, [isReady, isIdle, hasError, previewUrl, refreshKey]);

  // Auto-refresh iframe when parent signals a file save.
  // Defensive 500 ms trailing debounce — if two refreshSignal bumps land
  // in quick succession, collapse them into a single iframe remount so we
  // don't restart the 4 MB bundle load mid-flight.
  useEffect(() => {
    if (!refreshSignal || refreshSignal <= 0) return;
    const t = setTimeout(() => setRefreshKey((k) => k + 1), 500);
    return () => clearTimeout(t);
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
    <div className="h-full flex flex-col bg-white/[0.04] @container/preview">
      {/* Toolbar — compact: segmented Preview/Logs tabs on the left,
          device + lifecycle + build actions on the right. Labels collapse
          to icons on narrow panels so we never overflow the column. */}
      <div className="flex items-center justify-between gap-2 px-2 py-1.5 border-b border-border-subtle bg-white/[0.03]">
        {/* Left: Tabs */}
        <div className="flex items-center min-w-0">
          <div className="flex items-center rounded-md border border-border-subtle bg-white/[0.04] overflow-hidden shrink-0">
            <button
              onClick={() => setActiveTab("preview")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs transition-colors",
                activeTab === "preview"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-white/[0.08]"
              )}
              title="App preview"
            >
              <Smartphone className="h-3 w-3" />
              <span className="hidden @[280px]/preview:inline">App</span>
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs transition-colors",
                activeTab === "logs"
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-white/[0.08]"
              )}
              title="Build & runtime logs"
            >
              <Terminal className="h-3 w-3" />
              <span className="hidden @[280px]/preview:inline">Logs</span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 min-w-0">
          {/* Device Selector — name hides on narrow panels */}
          <div className="relative min-w-0" ref={deviceMenuRef}>
            <button
              onClick={() => setShowDeviceMenu(!showDeviceMenu)}
              className="flex items-center gap-1 px-1.5 py-1 text-xs text-text-secondary hover:bg-white/[0.08] rounded-md transition-colors border border-border-subtle bg-white/[0.04] min-w-0"
              title={`Device: ${selectedDevice.name}`}
            >
              {selectedDevice.group === "Tablet" ? (
                <TabletSmartphone className="h-3 w-3 shrink-0" />
              ) : selectedDevice.group === "Android" ? (
                <Monitor className="h-3 w-3 shrink-0" />
              ) : (
                <Smartphone className="h-3 w-3 shrink-0" />
              )}
              <span className="hidden @[360px]/preview:inline max-w-[72px] truncate">
                {selectedDevice.name}
              </span>
              <ChevronDown className="h-2.5 w-2.5 shrink-0" />
            </button>

            {showDeviceMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a24] backdrop-blur-xl border border-white/10 rounded-lg shadow-lg z-50 py-1 max-h-72 overflow-y-auto">
                {(["iOS", "Android", "Tablet"] as DeviceGroup[]).map((group) => {
                  const devices = DEVICE_PRESETS.filter((d) => d.group === group);
                  if (devices.length === 0) return null;
                  return (
                    <div key={group}>
                      <div className="px-3 py-1 text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                        {group}
                      </div>
                      {devices.map((device) => (
                        <button
                          key={device.id}
                          onClick={() => handleDeviceChange(device.id)}
                          className={cn(
                            "w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center gap-2",
                            device.id === deviceId
                              ? "bg-accent/15 text-accent font-medium"
                              : "text-text-secondary hover:bg-white/[0.06]"
                          )}
                        >
                          {device.group === "Tablet" ? (
                            <TabletSmartphone className="h-3 w-3 shrink-0" />
                          ) : (
                            <Smartphone className="h-3 w-3 shrink-0" />
                          )}
                          {device.name}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-border-subtle" />

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
          {/* Hard-restart: stops and recreates the preview container so
              a fresh bundle is compiled from the latest project files.
              Use this when an edit in chat doesn't show up via the soft
              iframe refresh (stale Metro cache / watcher missed write). */}
          {!isArchived && (isReady || isBuilding || hasError) && (
            <IconButton
              size="sm"
              onClick={() => restartPreview.mutate()}
              disabled={restartPreview.isPending}
              title="Rebuild preview (edits rebuild automatically — click for a manual refresh)"
            >
              <RotateCcw
                className={cn(
                  "h-3.5 w-3.5",
                  restartPreview.isPending && "animate-spin",
                )}
              />
            </IconButton>
          )}

          <div className="w-px h-4 bg-border-subtle" />

          {!isArchived && (
            <IconButton
              size="sm"
              onClick={() => setPhoneDialogOpen(true)}
              title={
                isPhoneReady
                  ? "Phone preview live — click to show QR code"
                  : isPhoneStarting
                    ? "Starting phone preview..."
                    : "Scan on your phone (Expo Go)"
              }
              className={cn(
                "relative",
                isPhoneStarting && "bg-accent/15 text-accent",
                isPhoneReady && "bg-emerald-500/15 text-emerald-400",
              )}
            >
              {isPhoneStarting ? (
                <Spinner size="sm" />
              ) : (
                <QrCode className="h-3.5 w-3.5" />
              )}
              {(isPhoneStarting || isPhoneReady) && (
                <span
                  className={cn(
                    "absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full",
                    isPhoneStarting &&
                      "bg-accent animate-pulse ring-2 ring-accent/30",
                    isPhoneReady && "bg-emerald-400",
                  )}
                />
              )}
            </IconButton>
          )}

          {!isArchived && (
            <IconButton
              size="sm"
              onClick={() => setApkDialogOpen(true)}
              title={
                isApkBuilding
                  ? "Build in progress — click to view log"
                  : apkStatus === "ready"
                    ? "APK ready — click to download"
                    : "Build mobile app"
              }
              className={cn(
                "relative",
                isApkBuilding && "bg-accent/15 text-accent",
                apkStatus === "ready" && "text-emerald-400",
                apkStatus === "error" && "text-danger",
              )}
            >
              {isApkBuilding ? (
                <Spinner size="sm" />
              ) : (
                <Package className="h-3.5 w-3.5" />
              )}
              {/* Status dot in the top-right corner — tiny but instantly
                  readable so users know a build is running even with the
                  APK dialog closed. */}
              {(isApkBuilding ||
                apkStatus === "ready" ||
                apkStatus === "error") && (
                <span
                  className={cn(
                    "absolute top-0.5 right-0.5 h-1.5 w-1.5 rounded-full",
                    isApkBuilding &&
                      "bg-accent animate-pulse ring-2 ring-accent/30",
                    apkStatus === "ready" && "bg-emerald-400",
                    apkStatus === "error" && "bg-danger",
                  )}
                />
              )}
            </IconButton>
          )}

          {!isArchived && (
            <IconButton
              size="sm"
              onClick={handleDownloadSource}
              disabled={isDownloading}
              title="Download source code (.zip) — includes mobile app + backend + deploy README"
            >
              {isDownloading ? (
                <Spinner size="sm" />
              ) : (
                <Download className="h-3.5 w-3.5" />
              )}
            </IconButton>
          )}
        </div>
      </div>

      {/* Persistent APK build banner — shown whenever a build is in
          flight so users know it's still running even after closing
          the dialog. Clicking it re-opens the dialog with full logs. */}
      {isApkBuilding && (
        <button
          onClick={() => setApkDialogOpen(true)}
          className="flex w-full items-center gap-2 px-3 py-1.5 bg-accent/10 border-b border-accent/20 shrink-0 hover:bg-accent/15 transition-colors text-left"
          title="Click to view build log"
        >
          <Spinner size="sm" />
          <span className="text-xs text-accent font-medium">
            Building mobile app on Expo EAS…
          </span>
          <span className="ml-auto text-[11px] text-accent/80 hidden @[280px]/preview:inline">
            View log
          </span>
        </button>
      )}

      <ApkBuildDialog
        open={apkDialogOpen}
        onClose={() => setApkDialogOpen(false)}
        projectId={projectId}
      />

      <PhonePreviewDialog
        open={phoneDialogOpen}
        onClose={() => setPhoneDialogOpen(false)}
        projectId={projectId}
      />

      {/* Content */}
      {/* Logs always mounted to preserve state; shown when active OR building */}
      <div className={activeTab === "logs" || isBuilding ? "flex-1 min-h-0 overflow-hidden flex flex-col" : "hidden"}>
        {isBuilding && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 border-b border-accent/20 shrink-0">
            <Spinner size="sm" />
            <span className="text-xs text-accent font-medium">Building preview...</span>
          </div>
        )}
        <div className="flex-1 min-h-0 overflow-hidden">
          <PreviewLogs projectId={projectId} />
        </div>
      </div>

      {/* Preview tab — phone frame */}
      <div className={activeTab === "preview" && !isBuilding ? "flex-1 min-h-0 bg-white/[0.06] overflow-hidden relative flex items-center justify-center" : "hidden"}>
        {hasError ? (
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
        ) : previewSrc ? (
          <DeviceFrame preset={selectedDevice}>
            <div className="relative w-full h-full">
              <iframe
                ref={iframeRef}
                key={refreshKey}
                src={previewSrc}
                onLoad={() => setIframeLoaded(true)}
                className="w-full h-full border-0 relative z-10 bg-white"
                title="Mobile App Preview"
              />
              {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-30 pointer-events-none">
                  <Spinner size="md" />
                  <p className="text-xs text-gray-400 mt-2">Loading app...</p>
                </div>
              )}
            </div>
          </DeviceFrame>
        ) : (
          <div className="text-center">
            <Smartphone className="h-12 w-12 text-white/[0.12] mx-auto mb-3" />
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
        )}
      </div>
    </div>
  );
}
