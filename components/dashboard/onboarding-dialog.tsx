"use client";

import { useState } from "react";
import { Sparkles, Code2, MessageSquare, ArrowRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OnboardingDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateProject: () => void;
}

const steps = [
  {
    icon: MessageSquare,
    title: "Tell AI what to build",
    description:
      "Describe your app idea in plain language. No coding knowledge needed — just say what you want!",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Code2,
    title: "Watch your code appear",
    description:
      "AI generates production-ready code in real time. You can see every file being created and modified.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Sparkles,
    title: "Preview & iterate",
    description:
      "See your app running live. Keep chatting with AI to add features, fix issues, or redesign anything.",
    color: "bg-warning/10 text-warning",
  },
];

export function OnboardingDialog({
  open,
  onClose,
  onCreateProject,
}: OnboardingDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onClose();
      onCreateProject();
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleSkip} className="max-w-md">
      <div className="text-center py-2">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? "w-8 bg-accent"
                  : i < currentStep
                    ? "w-4 bg-accent/40"
                    : "w-4 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-6`}
        >
          <step.icon className="h-8 w-8" />
        </div>

        {/* Content */}
        <h2 className="text-xl font-semibold text-text-primary mb-3">
          {step.title}
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto mb-8">
          {step.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Skip
          </button>
          <Button onClick={handleNext} className="group">
            {isLastStep ? "Create My First Project" : "Next"}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
