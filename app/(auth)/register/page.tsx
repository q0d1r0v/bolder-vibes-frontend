"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
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
      heading="Create account"
      description="Start building your next big idea with AI."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Display Name"
          labelExtra={
            <span className="text-gray-500 ml-1 font-normal">(optional)</span>
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
          <label className="block text-sm font-medium text-white mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 characters"
              className={`w-full h-11 px-4 pr-11 rounded-xl bg-white/[0.06] border text-sm text-white placeholder:text-gray-500 outline-none transition-all ${
                errors.password
                  ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/10"
                  : "border-white/[0.08] focus:border-accent focus:ring-2 focus:ring-accent/10"
              }`}
              {...register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
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

      <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
        {" · "}
        <Link href="/terms" className="hover:underline">Terms</Link>
        {" · "}
        <Link href="/privacy" className="hover:underline">Privacy</Link>
      </p>
    </AuthLayout>
  );
}
