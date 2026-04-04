"use client";

import { useState } from "react";
import { Plus, FolderOpen, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ProjectCard } from "@/components/dashboard/project-card";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { DeleteProjectDialog } from "@/components/dashboard/delete-project-dialog";
import { OnboardingDialog } from "@/components/dashboard/onboarding-dialog";
import { useProjects, useUpdateProject } from "@/hooks/queries/use-projects";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "ACTIVE" | "ARCHIVED";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("bolder-vibes-onboarded");
  });

  const debouncedSearch = useDebounce(search, 300);
  const { data, isLoading } = useProjects({
    page,
    limit: 20,
    search: debouncedSearch || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });
  const updateProject = useUpdateProject();

  const projects = data?.data;

  const handleArchive = (id: string) => {
    const project = data?.data?.find((p) => p.id === id);
    if (project) {
      updateProject.mutate({
        id,
        data: {
          status: project.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED",
        },
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            My Projects
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage and create your AI-powered projects
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchInput
          placeholder="Search projects..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          containerClassName="max-w-sm"
        />
        <div className="flex items-center rounded-lg border border-border-subtle bg-white overflow-hidden">
          {(["all", "ACTIVE", "ARCHIVED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                statusFilter === s
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:bg-gray-50"
              )}
            >
              {s === "all" ? "All" : s === "ACTIVE" ? "Active" : "Archived"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : projects && projects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onArchive={handleArchive}
                onDelete={(id) =>
                  setDeleteTarget({ id, name: project.name })
                }
              />
            ))}
          </div>

          {data?.meta && data.meta.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={<FolderOpen className="h-12 w-12" />}
          title="No projects yet"
          description="Create your first project to get started building with AI."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          }
        />
      )}

      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {deleteTarget && (
        <DeleteProjectDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          projectId={deleteTarget.id}
          projectName={deleteTarget.name}
        />
      )}

      <OnboardingDialog
        open={showOnboarding && !isLoading && (!projects || projects.length === 0)}
        onClose={() => {
          setShowOnboarding(false);
          localStorage.setItem("bolder-vibes-onboarded", "1");
        }}
        onCreateProject={() => {
          setShowOnboarding(false);
          localStorage.setItem("bolder-vibes-onboarded", "1");
          setCreateOpen(true);
        }}
      />
    </>
  );
}
