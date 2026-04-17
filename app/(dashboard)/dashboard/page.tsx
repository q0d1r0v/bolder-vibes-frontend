"use client";

import { useState } from "react";
import {
  Plus,
  FolderOpen,
  Sparkles,
  ShoppingCart,
  Users,
  Heart,
  GraduationCap,
  UtensilsCrossed,
  CheckSquare,
  Wallet,
  Smartphone,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { ProjectCard } from "@/components/dashboard/project-card";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { DeleteProjectDialog } from "@/components/dashboard/delete-project-dialog";
import { OnboardingDialog } from "@/components/dashboard/onboarding-dialog";
import { useAuth } from "@/hooks/use-auth";
import { useProjects, useUpdateProject } from "@/hooks/queries/use-projects";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "ACTIVE" | "ARCHIVED";

/** Quick-start tiles mirror the industries in CreateProjectDialog so users
 *  can jump straight from the empty dashboard into a templated project. */
const QUICK_STARTS = [
  {
    id: "ecommerce",
    title: "Online Store",
    description: "Products, cart, checkout",
    icon: ShoppingCart,
    tint: "#3b82f6",
  },
  {
    id: "social",
    title: "Social App",
    description: "Posts, profiles, likes",
    icon: Users,
    tint: "#8b5cf6",
  },
  {
    id: "health",
    title: "Fitness Tracker",
    description: "Workouts + progress",
    icon: Heart,
    tint: "#ef4444",
  },
  {
    id: "food",
    title: "Food Delivery",
    description: "Menus, orders, tracking",
    icon: UtensilsCrossed,
    tint: "#f97316",
  },
  {
    id: "productivity",
    title: "Todo / Notes",
    description: "Tasks, lists, reminders",
    icon: CheckSquare,
    tint: "#22c55e",
  },
  {
    id: "finance",
    title: "Expense Tracker",
    description: "Budget + spending",
    icon: Wallet,
    tint: "#14b8a6",
  },
  {
    id: "education",
    title: "Learning App",
    description: "Lessons + quizzes",
    icon: GraduationCap,
    tint: "#f59e0b",
  },
  {
    id: "custom",
    title: "Start from scratch",
    description: "Describe anything",
    icon: Smartphone,
    tint: "#6366f1",
  },
] as const;

export default function DashboardPage() {
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [presetTemplate, setPresetTemplate] = useState<string | undefined>();
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
  const totalProjects = data?.meta?.total ?? 0;
  const hasProjects = !!projects && projects.length > 0;

  const firstName = (user?.name ?? user?.email ?? "").split(" ")[0] ||
    (user?.email?.split("@")[0] ?? "");
  const greeting = firstName
    ? `Welcome back, ${firstName}`
    : "Welcome to Bolder Vibes";

  const openCreateWith = (templateId?: string) => {
    setPresetTemplate(templateId);
    setCreateOpen(true);
  };

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
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-accent/[0.18] via-accent/[0.08] to-transparent p-8 mb-8">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-accent/20 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-accent font-medium mb-2">
            <Sparkles className="h-3 w-3" />
            AI mobile app builder
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-text-primary">
            {greeting}
          </h1>
          <p className="text-sm sm:text-base text-text-secondary mt-2 max-w-xl">
            Describe the app you want in plain language. We&apos;ll design it,
            build it, and let you install it on your phone.
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-5">
            <Button onClick={() => openCreateWith("custom")} size="md">
              <Plus className="h-4 w-4" />
              New app
            </Button>
            {totalProjects > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-text-muted ml-1">
                <FolderOpen className="h-3.5 w-3.5" />
                {totalProjects} project{totalProjects === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── Quick-start tiles (only when no projects / searching empty) ── */}
      {!hasProjects && !isLoading && !debouncedSearch && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-[0.12em] text-text-muted font-medium mb-3">
            Pick a starting point
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {QUICK_STARTS.map((qs) => {
              const Icon = qs.icon;
              return (
                <button
                  key={qs.id}
                  onClick={() => openCreateWith(qs.id)}
                  className="group text-left rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all p-4"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${qs.tint}1f` }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: qs.tint }}
                    />
                  </div>
                  <p className="text-sm font-medium text-text-primary">
                    {qs.title}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5 line-clamp-1">
                    {qs.description}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* ── My projects header + filters ───────────────────── */}
      {(hasProjects || debouncedSearch || !isLoading) && (
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">
                Your projects
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {hasProjects
                  ? "Click any project to continue editing"
                  : "Projects you start will show up here"}
              </p>
            </div>
            {hasProjects && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => openCreateWith("custom")}
              >
                <Plus className="h-3.5 w-3.5" />
                New
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
            <SearchInput
              placeholder="Search your projects..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              containerClassName="flex-1 max-w-md"
            />
            <div className="flex items-center rounded-lg border border-border-subtle bg-white/[0.04] overflow-hidden">
              {(["all", "ACTIVE", "ARCHIVED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium transition-colors",
                    statusFilter === s
                      ? "bg-accent text-white"
                      : "text-text-secondary hover:bg-white/[0.06]"
                  )}
                >
                  {s === "all" ? "All" : s === "ACTIVE" ? "Active" : "Archived"}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-44" />
              ))}
            </div>
          ) : hasProjects ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
          ) : debouncedSearch ? (
            <EmptyState
              icon={<Search className="h-10 w-10" />}
              title="No matches"
              description={`No projects match "${debouncedSearch}". Try a different search.`}
            />
          ) : (
            <EmptyState
              icon={<FolderOpen className="h-10 w-10" />}
              title="No projects yet"
              description="Pick a starting point above, or describe your own idea."
              action={
                <Button onClick={() => openCreateWith("custom")}>
                  <Plus className="h-4 w-4" />
                  Start from scratch
                </Button>
              }
            />
          )}
        </section>
      )}

      <CreateProjectDialog
        open={createOpen}
        onClose={() => {
          setCreateOpen(false);
          setPresetTemplate(undefined);
        }}
        initialTemplateId={presetTemplate}
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
        open={
          showOnboarding && !isLoading && (!projects || projects.length === 0)
        }
        onClose={() => {
          setShowOnboarding(false);
          localStorage.setItem("bolder-vibes-onboarded", "1");
        }}
        onCreateProject={() => {
          setShowOnboarding(false);
          localStorage.setItem("bolder-vibes-onboarded", "1");
          openCreateWith("custom");
        }}
      />
    </>
  );
}
