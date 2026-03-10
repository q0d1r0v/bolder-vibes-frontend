"use client";

import { X, Brain, Code, Sparkles } from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { useAgentStore } from "@/stores/agent-store";
import { useSocket } from "@/hooks/use-socket";
import type { AgentStepStatus, AgentType } from "@/types";

const AGENT_STEPS: {
  agentType: AgentType;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    agentType: "PLANNER",
    label: "Planning",
    description: "Analyzing your request...",
    icon: <Brain className="h-4 w-4" />,
  },
  {
    agentType: "DEVELOPER",
    label: "Developing",
    description: "Writing code...",
    icon: <Code className="h-4 w-4" />,
  },
  {
    agentType: "REFACTOR",
    label: "Refactoring",
    description: "Optimizing code...",
    icon: <Sparkles className="h-4 w-4" />,
  },
];

export function AgentProgress() {
  const { currentTask, steps, isRunning, partialOutput } = useAgentStore();
  const { emit } = useSocket();

  if (!isRunning || !currentTask) return null;

  const stepperSteps = AGENT_STEPS.map(({ agentType, label, description }) => {
    const step = steps.find((s) => s.agentType === agentType);
    const status: AgentStepStatus = step?.status || "PENDING";

    return {
      label,
      description: status === "RUNNING" ? description : undefined,
      status,
    };
  });

  const handleCancel = () => {
    emit("cancel_task", { taskId: currentTask.id });
  };

  return (
    <div className="border-t border-border-subtle bg-gray-50/50 px-4 py-3">
      <Stepper steps={stepperSteps} />

      {partialOutput && (
        <div className="mt-2 p-2 bg-white rounded-lg text-xs text-text-secondary max-h-20 overflow-y-auto">
          {partialOutput}
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={handleCancel}
        className="mt-2 text-danger hover:text-danger"
      >
        <X className="h-3.5 w-3.5" />
        Cancel
      </Button>
    </div>
  );
}
