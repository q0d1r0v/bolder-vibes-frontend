import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "elevated" | "filled" | "outlined";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  elevated:
    "bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-border-subtle",
  filled: "bg-surface-secondary rounded-2xl",
  outlined: "bg-white rounded-2xl border border-border-subtle",
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "elevated", hoverable = false, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          variantStyles[variant],
          hoverable && "transition-all duration-200 hover:shadow-lg hover:shadow-black/6 hover:-translate-y-0.5 hover:border-gray-200 cursor-pointer",
          "p-6",
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />;
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-border-subtle", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardContent, CardFooter, type CardProps };
