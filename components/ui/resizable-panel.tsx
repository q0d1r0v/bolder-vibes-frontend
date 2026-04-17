"use client";

import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResizablePanelGroupProps {
  direction: "horizontal" | "vertical";
  children: ReactNode;
  className?: string;
}

function ResizablePanelGroup({
  direction,
  children,
  className,
}: ResizablePanelGroupProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full",
        direction === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ResizablePanelProps {
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
  children: ReactNode;
  className?: string;
}

function ResizablePanel({
  defaultSize,
  children,
  className,
}: ResizablePanelProps) {
  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{ flexBasis: `${defaultSize}%`, flexGrow: 0, flexShrink: 0 }}
    >
      {children}
    </div>
  );
}

interface ResizableHandleProps {
  direction: "horizontal" | "vertical";
  onResize?: (delta: number) => void;
  className?: string;
}

function ResizableHandle({ direction, className }: ResizableHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={cn(
        "flex-shrink-0 flex items-center justify-center group transition-colors",
        direction === "horizontal"
          ? "w-1 cursor-col-resize hover:bg-accent/20"
          : "h-1 cursor-row-resize hover:bg-accent/20",
        isDragging && "bg-accent/30",
        className
      )}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
    >
      <div
        className={cn(
          "rounded-full bg-white/[0.12] group-hover:bg-accent/40 transition-colors",
          direction === "horizontal" ? "w-0.5 h-8" : "h-0.5 w-8"
        )}
      />
    </div>
  );
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
};
