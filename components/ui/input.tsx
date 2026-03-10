import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelRight?: React.ReactNode;
  labelExtra?: React.ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelRight, labelExtra, error, className = "", ...props }, ref) => {
    return (
      <div>
        {(label || labelRight) && (
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-text-primary">
              {label}
              {labelExtra}
            </label>
            {labelRight}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full h-11 px-4 rounded-full bg-white border text-sm text-text-primary placeholder:text-text-muted outline-none transition-all ${
            error
              ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/10"
              : "border-border-subtle focus:border-accent focus:ring-2 focus:ring-accent/10"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-danger mt-1.5">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
