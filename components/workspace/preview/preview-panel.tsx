"use client";

import { useState, useEffect } from "react";
import { RefreshCw, ExternalLink, Monitor, Tablet, Smartphone } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Spinner } from "@/components/ui/spinner";
import { useSocket } from "@/hooks/use-socket";
import { cn } from "@/lib/utils";

type DeviceSize = "desktop" | "tablet" | "mobile";

const deviceWidths: Record<DeviceSize, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

interface PreviewPanelProps {
  projectId: string;
}

export function PreviewPanel({ projectId }: PreviewPanelProps) {
  const { subscribe } = useSocket();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [device, setDevice] = useState<DeviceSize>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const unsubs = [
      subscribe("preview:building", () => {
        setIsBuilding(true);
        setError(null);
      }),
      subscribe<{ url: string }>("preview:ready", (data) => {
        setPreviewUrl(data.url);
        setIsBuilding(false);
        setError(null);
      }),
      subscribe<{ error: string }>("preview:error", (data) => {
        setIsBuilding(false);
        setError(data.error);
      }),
    ];

    return () => unsubs.forEach((unsub) => unsub());
  }, [subscribe]);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle bg-gray-50">
        <div className="flex items-center gap-1">
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

        <div className="flex items-center gap-1">
          <IconButton
            size="sm"
            onClick={() => setRefreshKey((k) => k + 1)}
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
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-hidden">
        {isBuilding ? (
          <div className="text-center">
            <Spinner size="lg" />
            <p className="text-sm text-text-muted mt-3">Building preview...</p>
          </div>
        ) : error ? (
          <div className="text-center px-6">
            <p className="text-sm text-danger font-medium">Build Error</p>
            <p className="text-xs text-text-muted mt-1 max-w-sm">{error}</p>
          </div>
        ) : previewUrl ? (
          <iframe
            key={refreshKey}
            src={previewUrl}
            className="bg-white border-0"
            style={{
              width: deviceWidths[device],
              height: "100%",
              maxWidth: "100%",
            }}
            title="Preview"
          />
        ) : (
          <div className="text-center">
            <p className="text-sm text-text-muted">No preview available</p>
            <p className="text-xs text-text-muted mt-1">
              Send a message to generate code
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
