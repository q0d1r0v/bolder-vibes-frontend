"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormData } from "@/lib/validators";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isRegisterPending } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      email: data.email,
      password: data.password,
      name: data.name || undefined,
    });
  };

  return (
    <AuthLayout
      heading={
        <>
          Start building
          <br />
          your next big idea
        </>
      }
      description="Create an account and let AI help you turn your vision into a fully functional application in minutes."
    >
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-text-primary mb-2">
        Create your account
      </h1>
      <p className="text-sm text-text-secondary mb-8">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-accent font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Display Name"
          labelExtra={
            <span className="text-text-muted ml-1 font-normal">
              (optional)
            </span>
          }
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              className={`w-full h-11 px-4 pr-11 rounded-full bg-white border text-sm text-text-primary placeholder:text-text-muted outline-none transition-all ${
                errors.password
                  ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/10"
                  : "border-border-subtle focus:border-accent focus:ring-2 focus:ring-accent/10"
              }`}
              {...register("password")}
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
          {errors.password && (
            <p className="text-xs text-danger mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" fullWidth loading={isRegisterPending}>
          {isRegisterPending ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-xs text-text-muted text-center mt-6 leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="text-text-secondary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-text-secondary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  );
}
