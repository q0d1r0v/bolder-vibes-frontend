"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

interface LogEntry {
  line: string;
  timestamp: string;
}

interface PreviewLogsProps {
  projectId: string;
}

export function PreviewLogs({ projectId }: PreviewLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { subscribe } = useSocket();

  useEffect(() => {
    const unsubs = [
      subscribe<{ projectId: string; line: string; timestamp: string }>(
        "sandbox:log",
        (data) => {
          if (data.projectId === projectId) {
            setLogs((prev) => [...prev.slice(-500), { line: data.line, timestamp: data.timestamp }]);
          }
        },
      ),
      subscribe<{ projectId: string; error: string }>(
        "preview:error",
        (data) => {
          if (data.projectId === projectId) {
            setLogs((prev) => [
              ...prev.slice(-500),
              { line: `[ERROR] ${data.error}`, timestamp: new Date().toISOString() },
            ]);
          }
        },
      ),
      subscribe<{ projectId: string }>(
        "preview:building",
        (data) => {
          if (data.projectId === projectId) {
            setLogs((prev) => [
              ...prev,
              { line: "Preview build started...", timestamp: new Date().toISOString() },
            ]);
          }
        },
      ),
      subscribe<{ projectId: string; url: string }>(
        "preview:ready",
        (data) => {
          if (data.projectId === projectId) {
            setLogs((prev) => [
              ...prev,
              { line: `Preview ready at ${data.url}`, timestamp: new Date().toISOString() },
            ]);
          }
        },
      ),
    ];

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [projectId, subscribe]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs.length]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-1 border-b border-border-subtle bg-white/[0.03]">
        <span className="text-xs text-text-muted">
          {logs.length} lines
        </span>
        <IconButton
          size="sm"
          onClick={() => setLogs([])}
          title="Clear logs"
        >
          <Trash2 className="h-3 w-3" />
        </IconButton>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-900 p-2 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">
            No logs yet. Start a preview to see logs.
          </p>
        ) : (
          logs.map((entry, i) => (
            <div key={i} className="py-0.5 leading-relaxed">
              <span className="text-gray-500 select-none mr-2">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
              <span
                className={
                  entry.line.toLowerCase().includes("error") ||
                  entry.line.toLowerCase().includes("err!")
                    ? "text-red-400"
                    : entry.line.toLowerCase().includes("warn")
                      ? "text-yellow-400"
                      : "text-gray-200"
                }
              >
                {entry.line}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
