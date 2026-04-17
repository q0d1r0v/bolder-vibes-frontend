"use client";

import { useState } from "react";
import { Sparkles, Smartphone, MessageSquare, ArrowRight } from "lucide-react";
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
    title: "Describe your app idea",
    description:
      "Tell AI what you want to build in plain language. No coding knowledge needed — just describe your mobile app!",
    color: "bg-accent/15 text-accent",
  },
  {
    icon: Smartphone,
    title: "AI builds your app",
    description:
      "AI creates your mobile app in real time. Watch it come to life as screens, navigation, and features are built automatically.",
    color: "bg-success/15 text-success",
  },
  {
    icon: Sparkles,
    title: "Preview & refine",
    description:
      "See your app running live on a phone preview. Keep chatting to add features, change designs, or tweak anything.",
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
                    : "w-4 bg-white/[0.06]"
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
            {isLastStep ? "Create My First App" : "Next"}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
