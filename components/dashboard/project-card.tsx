"use client";

import { useRouter } from "next/navigation";
import { MoreVertical, FileText, Archive, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { formatRelativeTime } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onArchive, onDelete }: ProjectCardProps) {
  const router = useRouter();

  const menuItems: DropdownItem[] = [
    {
      label: project.status === "ARCHIVED" ? "Unarchive" : "Archive",
      icon: <Archive className="h-4 w-4" />,
      onClick: () => onArchive(project.id),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: () => onDelete(project.id),
      danger: true,
    },
  ];

  return (
    <Card
      hoverable
      className="relative group cursor-pointer"
      onClick={() => router.push(ROUTES.PROJECT(project.id))}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-text-primary truncate">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-text-secondary mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Dropdown
            trigger={
              <IconButton size="sm">
                <MoreVertical className="h-4 w-4" />
              </IconButton>
            }
            items={menuItems}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Badge
          variant={project.status === "ACTIVE" ? "success" : "outline"}
        >
          {project.status}
        </Badge>

        {project._count && (
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            <FileText className="h-3.5 w-3.5" />
            {project._count.files}
          </span>
        )}

        <span className="text-xs text-text-muted ml-auto">
          {formatRelativeTime(project.createdAt)}
        </span>
      </div>
    </Card>
  );
}
