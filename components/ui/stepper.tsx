import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";
import type { AgentStepStatus } from "@/types";

interface Step {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  status: AgentStepStatus;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <StepIcon status={step.status} />
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "w-0.5 h-8 mt-1",
                  step.status === "COMPLETED"
                    ? "bg-emerald-500"
                    : "bg-white/[0.08]"
                )}
              />
            )}
          </div>
          <div className="pb-8">
            <p
              className={cn(
                "text-sm font-medium",
                step.status === "RUNNING"
                  ? "text-accent"
                  : step.status === "COMPLETED"
                  ? "text-emerald-400"
                  : step.status === "FAILED"
                  ? "text-danger"
                  : "text-text-muted"
              )}
            >
              {step.label}
            </p>
            {step.description && (
              <p className="text-xs text-text-muted mt-0.5">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepIcon({ status }: { status: AgentStepStatus }) {
  const base =
    "flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0";

  switch (status) {
    case "RUNNING":
      return (
        <div className={cn(base, "bg-accent-soft")}>
          <Spinner size="sm" />
        </div>
      );
    case "COMPLETED":
      return (
        <div className={cn(base, "bg-emerald-500/20")}>
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        </div>
      );
    case "FAILED":
      return (
        <div className={cn(base, "bg-red-500/20")}>
          <X className="h-3.5 w-3.5 text-danger" />
        </div>
      );
    case "SKIPPED":
      return (
        <div className={cn(base, "bg-white/[0.06]")}>
          <Minus className="h-3.5 w-3.5 text-text-muted" />
        </div>
      );
    default:
      return <div className={cn(base, "bg-white/[0.06]")} />;
  }
}

export { Stepper, type StepperProps };
