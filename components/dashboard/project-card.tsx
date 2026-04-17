"use client";

import { useRouter } from "next/navigation";
import {
  MoreVertical,
  FileText,
  Archive,
  Trash2,
  ShoppingCart,
  Users,
  Heart,
  GraduationCap,
  UtensilsCrossed,
  CheckSquare,
  Wallet,
  Smartphone,
  Clock,
} from "lucide-react";
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

/** Maps the industry template saved on the project to a coloured icon so
 *  each card has an at-a-glance visual anchor. Falls back to a neutral
 *  phone icon for anything we don't recognise. */
const INDUSTRY_META: Record<
  string,
  {
    icon: React.ComponentType<{
      className?: string;
      style?: React.CSSProperties;
    }>;
    tint: string;
    label: string;
  }
> = {
  ecommerce: { icon: ShoppingCart, tint: "#3b82f6", label: "E-commerce" },
  social: { icon: Users, tint: "#8b5cf6", label: "Social" },
  health: { icon: Heart, tint: "#ef4444", label: "Health" },
  education: { icon: GraduationCap, tint: "#f59e0b", label: "Education" },
  food: { icon: UtensilsCrossed, tint: "#f97316", label: "Food" },
  productivity: { icon: CheckSquare, tint: "#22c55e", label: "Productivity" },
  finance: { icon: Wallet, tint: "#14b8a6", label: "Finance" },
  custom: { icon: Smartphone, tint: "#6366f1", label: "Custom" },
};

function getIndustry(project: Project) {
  const id = project.templateId ?? "custom";
  return INDUSTRY_META[id] ?? INDUSTRY_META.custom;
}

export function ProjectCard({ project, onArchive, onDelete }: ProjectCardProps) {
  const router = useRouter();
  const industry = getIndustry(project);
  const Icon = industry.icon;
  const isArchived = project.status === "ARCHIVED";
  const updatedAt = project.updatedAt ?? project.createdAt;

  const menuItems: DropdownItem[] = [
    {
      label: isArchived ? "Unarchive" : "Archive",
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
    <div
      onClick={() => router.push(ROUTES.PROJECT(project.id))}
      className="group relative cursor-pointer rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/[0.15] transition-all p-5"
    >
      {/* Coloured rail on the left — subtle industry accent */}
      <div
        className="absolute top-4 bottom-4 left-0 w-[3px] rounded-r-full opacity-70 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: industry.tint }}
      />

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{
            backgroundColor: `${industry.tint}1f`,
            boxShadow: `inset 0 0 0 1px ${industry.tint}33`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: industry.tint }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold text-text-primary truncate">
                {project.name}
              </h3>
              <p className="text-[11px] text-text-muted mt-0.5">
                {industry.label}
              </p>
            </div>

            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <Dropdown
                trigger={
                  <IconButton
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Project menu"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </IconButton>
                }
                items={menuItems}
              />
            </div>
          </div>

          {project.description && (
            <p className="text-xs text-text-secondary mt-2 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer meta */}
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.05]">
        {isArchived ? (
          <Badge variant="outline" className="text-[10px]">
            Archived
          </Badge>
        ) : (
          <Badge variant="success" className="text-[10px]">
            Active
          </Badge>
        )}

        {project._count?.files !== undefined && (
          <span className="inline-flex items-center gap-1 text-[11px] text-text-muted">
            <FileText className="h-3 w-3" />
            {project._count.files} files
          </span>
        )}

        <span className="inline-flex items-center gap-1 text-[11px] text-text-muted ml-auto">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(updatedAt)}
        </span>
      </div>
    </div>
  );
}
