"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff, CheckCircle, KeyRound } from "lucide-react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { resetPassword } from "@/lib/api/auth.api";

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPassword(token, data.newPassword);
      setIsReset(true);
    } catch {
      toast.error("Failed to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        heading="Invalid link"
        description="This reset link is invalid or has expired."
      >
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-sm text-text-secondary">
            Please request a new password reset link.
          </p>
          <Link href="/forgot-password">
            <Button fullWidth>Request New Link</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (isReset) {
    return (
      <AuthLayout
        heading="Password reset"
        description="Your password has been successfully reset."
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
              Password Reset Successful
            </h1>
            <p className="text-sm text-text-secondary">
              You can now sign in with your new password.
            </p>
          </div>

          <Link href="/login">
            <Button fullWidth>Sign In</Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading="Set new password"
      description="Choose a strong password to secure your account."
    >
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>

      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-6">
        <KeyRound className="h-6 w-6 text-accent" />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
        Set a new password
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        Your new password must be at least 8 characters and contain uppercase,
        lowercase, and a number.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              className={`w-full h-11 px-4 pr-11 rounded-full bg-white border text-sm text-text-primary placeholder:text-text-muted outline-none transition-all ${
                errors.newPassword
                  ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/10"
                  : "border-border-subtle focus:border-accent focus:ring-2 focus:ring-accent/10"
              }`}
              {...register("newPassword")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-xs text-danger mt-1.5">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Re-enter your password"
            className={`w-full h-11 px-4 rounded-full bg-white border text-sm text-text-primary placeholder:text-text-muted outline-none transition-all ${
              errors.confirmPassword
                ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/10"
                : "border-border-subtle focus:border-accent focus:ring-2 focus:ring-accent/10"
            }`}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-danger mt-1.5">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" fullWidth loading={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
