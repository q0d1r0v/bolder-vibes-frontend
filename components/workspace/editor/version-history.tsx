"use client";

import { RotateCcw, Clock, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatRelativeTime } from "@/lib/utils";
import { useFileVersions, useRestoreVersion } from "@/hooks/queries/use-files";
import type { FileVersion } from "@/types";

interface VersionHistoryProps {
  projectId: string;
  fileId: string;
}

export function VersionHistory({ projectId, fileId }: VersionHistoryProps) {
  const { data: versions, isLoading } = useFileVersions(projectId, fileId);
  const restoreVersion = useRestoreVersion(projectId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!versions || versions.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted text-sm">
        No version history
      </div>
    );
  }

  return (
    <div className="space-y-1 p-2">
      <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider px-2 py-1">
        Version History
      </h3>
      {versions.map((version) => (
        <div
          key={version.id}
          className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-black/[0.04] group"
        >
          <div className="flex items-center gap-2 min-w-0">
            {version.agentStepId ? (
              <Bot className="h-4 w-4 text-accent flex-shrink-0" />
            ) : (
              <Clock className="h-4 w-4 text-text-muted flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm text-text-primary truncate">
                v{version.version}
                {version.message && ` - ${version.message}`}
              </p>
              <p className="text-xs text-text-muted">
                {formatRelativeTime(version.createdAt)}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              restoreVersion.mutate({ fileId, versionId: version.id })
            }
            className="p-1.5 rounded-md text-text-muted hover:text-accent hover:bg-accent-soft/50 opacity-0 group-hover:opacity-100 transition-all"
            title="Restore this version"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
