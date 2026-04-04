"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateProject } from "@/hooks/queries/use-projects";
import { useTemplates } from "@/hooks/queries/use-projects";
import { createProjectSchema, type CreateProjectFormData } from "@/lib/validators";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
  const router = useRouter();
  const createProject = useCreateProject();
  const { data: templates, isLoading: templatesLoading } = useTemplates({ enabled: open });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      templateId: undefined,
    },
  });

  const selectedTemplate = watch("templateId");

  const onSubmit = (data: CreateProjectFormData) => {
    createProject.mutate(data, {
      onSuccess: (project) => {
        reset();
        onClose();
        router.push(ROUTES.PROJECT(project.id));
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Create new project"
      description="Start a new project from scratch or choose a template."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Project Name"
          placeholder="My awesome project"
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Description{" "}
            <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="What are you building?"
            rows={3}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl bg-white border border-border-subtle text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/10 resize-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-danger mt-1">{errors.description.message}</p>
          )}
        </div>

        {templatesLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : templates && templates.length > 0 ? (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Template
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue("templateId", undefined)}
                className={cn(
                  "text-left p-3 rounded-xl border-2 transition-all",
                  !selectedTemplate
                    ? "border-accent bg-accent-soft/30"
                    : "border-border-subtle hover:border-gray-300"
                )}
              >
                <p className="text-sm font-medium text-text-primary">Blank Project</p>
                <p className="text-xs text-text-muted mt-0.5">Start from scratch</p>
              </button>

              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setValue("templateId", template.id)}
                  className={cn(
                    "text-left p-3 rounded-xl border-2 transition-all",
                    selectedTemplate === template.id
                      ? "border-accent bg-accent-soft/30"
                      : "border-border-subtle hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text-primary">
                      {template.name}
                    </p>
                    {selectedTemplate === template.id && (
                      <Check className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createProject.isPending}>
            Create Project
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
