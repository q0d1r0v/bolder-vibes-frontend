"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Check,
  ShoppingCart,
  Users,
  Heart,
  GraduationCap,
  UtensilsCrossed,
  CheckSquare,
  Wallet,
  Smartphone,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateProject } from "@/hooks/queries/use-projects";
import { createProjectSchema, type CreateProjectFormData } from "@/lib/validators";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  generateInitialPrompt,
  PENDING_PROMPT_KEY,
  PENDING_PLAN_MODE_KEY,
} from "@/lib/prompt-generator";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
  /** Industry / template ID to preselect (e.g. from a quick-start tile). */
  initialTemplateId?: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  ShoppingCart,
  Users,
  Heart,
  GraduationCap,
  UtensilsCrossed,
  CheckSquare,
  Wallet,
  Smartphone,
};

const INDUSTRIES = [
  { id: "ecommerce", name: "E-Commerce", icon: "ShoppingCart", color: "#3b82f6", description: "Online store, products, cart" },
  { id: "social", name: "Social Network", icon: "Users", color: "#3B82F6", description: "Posts, profiles, messaging" },
  { id: "health", name: "Health & Fitness", icon: "Heart", color: "#EF4444", description: "Workouts, diet, health" },
  { id: "education", name: "Education", icon: "GraduationCap", color: "#F59E0B", description: "Courses, quizzes, learning" },
  { id: "food", name: "Food & Delivery", icon: "UtensilsCrossed", color: "#F97316", description: "Restaurants, ordering" },
  { id: "productivity", name: "Productivity", icon: "CheckSquare", color: "#22C55E", description: "Tasks, notes, calendar" },
  { id: "finance", name: "Finance", icon: "Wallet", color: "#14B8A6", description: "Budget, expenses, reports" },
  { id: "custom", name: "Custom App", icon: "Smartphone", color: "#6366F1", description: "Build anything you want" },
];

export function CreateProjectDialog({
  open,
  onClose,
  initialTemplateId,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const createProject = useCreateProject();

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
      templateId: initialTemplateId ?? "custom",
    },
  });

  // When the dialog opens with a quick-start template preselected, make
  // sure the form reflects it (reset() above only runs on mount).
  useEffect(() => {
    if (open && initialTemplateId) {
      setValue("templateId", initialTemplateId);
    }
  }, [open, initialTemplateId, setValue]);

  const selectedTemplate = watch("templateId");

  const onSubmit = (data: CreateProjectFormData) => {
    const industryId = data.templateId || "custom";
    createProject.mutate({ ...data, templateId: industryId }, {
      onSuccess: (project) => {
        const prompt = generateInitialPrompt({
          industryId,
          appName: data.name,
          description: data.description,
        });
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(PENDING_PROMPT_KEY(project.id), prompt);
            sessionStorage.setItem(PENDING_PLAN_MODE_KEY(project.id), "1");
          } catch {
            // storage quota/unavailable — ignore, prefill is best-effort
          }
        }
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
      title="Create new app"
      description="Choose an industry and describe your mobile app idea."
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="App Name"
          placeholder="My awesome app"
          error={errors.name?.message}
          {...register("name")}
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Description{" "}
            <span className="text-text-muted font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="What does your app do?"
            rows={2}
            maxLength={500}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-border-subtle text-sm text-text-primary placeholder:text-text-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/10 resize-none"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-danger mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Choose Industry
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {INDUSTRIES.map((industry) => {
              const Icon = ICON_MAP[industry.icon];
              const isSelected = selectedTemplate === industry.id;
              return (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => setValue("templateId", industry.id)}
                  className={cn(
                    "text-left p-3 rounded-xl border-2 transition-all",
                    isSelected
                      ? "border-accent bg-accent-soft/30"
                      : "border-border-subtle hover:border-white/[0.15]"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${industry.color}15` }}
                    >
                      {Icon && <Icon className="h-4 w-4" style={{ color: industry.color }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-text-primary">
                          {industry.name}
                        </p>
                        {isSelected && <Check className="h-3.5 w-3.5 text-accent shrink-0" />}
                      </div>
                      <p className="text-xs text-text-muted truncate">
                        {industry.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={createProject.isPending}>
            Create App
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
