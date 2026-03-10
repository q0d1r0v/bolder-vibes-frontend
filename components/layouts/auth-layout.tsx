"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

interface AuthLayoutProps {
  heading: React.ReactNode;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({ heading, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[#7C3AED]/[0.06] to-[#A78BFA]/[0.04] border-r border-border-subtle items-center justify-center">
        <div className="absolute top-10 left-10">
          <Logo />
        </div>

        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#7C3AED]/[0.06] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-[#A78BFA]/[0.06] rounded-full blur-3xl" />

        <div className="relative z-10 px-16 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-semibold tracking-tight text-text-primary mb-4 leading-tight">
              {heading}
            </h2>
            <p className="text-base text-text-secondary leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden mb-10">
            <Logo />
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
