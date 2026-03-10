"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileCode2,
  FileJson,
  FileType,
  Image,
} from "lucide-react";
import { cn, getFileExtension } from "@/lib/utils";
import type { ProjectFile } from "@/types";

interface TreeNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: TreeNode[];
  file?: ProjectFile;
}

function buildFileTree(files: ProjectFile[]): TreeNode[] {
  const root: TreeNode[] = [];

  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));

  for (const file of sorted) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;

      let node = current.find((n) => n.name === part);

      if (!node) {
        node = {
          name: part,
          type: isFile ? "file" : "folder",
          path: parts.slice(0, i + 1).join("/"),
          children: isFile ? undefined : [],
          file: isFile ? file : undefined,
        };
        current.push(node);
      }

      if (node.children) {
        current = node.children;
      }
    }
  }

  return sortTree(root);
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function getFileIcon(ext: string) {
  switch (ext) {
    case "tsx":
    case "jsx":
      return <FileCode2 className="h-4 w-4 text-blue-500" />;
    case "ts":
    case "js":
      return <FileCode2 className="h-4 w-4 text-yellow-600" />;
    case "json":
      return <FileJson className="h-4 w-4 text-amber-500" />;
    case "css":
    case "scss":
      return <FileType className="h-4 w-4 text-purple-500" />;
    case "png":
    case "jpg":
    case "svg":
      return <Image className="h-4 w-4 text-green-500" />;
    default:
      return <File className="h-4 w-4 text-text-muted" />;
  }
}

interface FileExplorerProps {
  files: ProjectFile[];
  selectedFileId: string | null;
  onFileSelect: (file: ProjectFile) => void;
}

export function FileExplorer({
  files,
  selectedFileId,
  onFileSelect,
}: FileExplorerProps) {
  const tree = useMemo(() => buildFileTree(files), [files]);

  return (
    <div className="text-sm">
      {tree.map((node) => (
        <TreeNodeComponent
          key={node.path}
          node={node}
          depth={0}
          selectedFileId={selectedFileId}
          onFileSelect={onFileSelect}
        />
      ))}
    </div>
  );
}

function TreeNodeComponent({
  node,
  depth,
  selectedFileId,
  onFileSelect,
}: {
  node: TreeNode;
  depth: number;
  selectedFileId: string | null;
  onFileSelect: (file: ProjectFile) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-1.5 py-1 px-2 hover:bg-black/[0.04] rounded-md transition-colors"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
          )}
          {expanded ? (
            <FolderOpen className="h-4 w-4 text-accent flex-shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-accent flex-shrink-0" />
          )}
          <span className="truncate text-text-primary">{node.name}</span>
        </button>
        {expanded &&
          node.children?.map((child) => (
            <TreeNodeComponent
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFileId={selectedFileId}
              onFileSelect={onFileSelect}
            />
          ))}
      </div>
    );
  }

  const ext = getFileExtension(node.name);
  const isSelected = node.file?.id === selectedFileId;

  return (
    <button
      onClick={() => node.file && onFileSelect(node.file)}
      className={cn(
        "w-full flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors",
        isSelected
          ? "bg-accent-soft/50 text-accent"
          : "hover:bg-black/[0.04] text-text-primary"
      )}
      style={{ paddingLeft: `${depth * 12 + 24}px` }}
    >
      {getFileIcon(ext)}
      <span className="truncate">{node.name}</span>
    </button>
  );
}
