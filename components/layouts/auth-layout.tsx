"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";

const HeroWave = dynamic(
  () => import("@/components/ui/ai-input-hero").then((m) => ({ default: m.HeroWave })),
  { ssr: false, loading: () => null }
);

interface AuthLayoutProps {
  heading: React.ReactNode;
  description: string;
  children: React.ReactNode;
}

export function AuthLayout({ heading, description, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative">
      {/* Wave background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <HeroWave bgOnly />
      </div>

      {/* Auth card */}
      <div className="relative z-[1] w-full max-w-md mx-4 my-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#1a1a24]/90 backdrop-blur-xl rounded-2xl border border-white/[0.08] p-8 sm:p-10 shadow-2xl"
        >
          {/* Logo */}
          <div className="mb-8">
            <Logo />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">
            {heading}
          </h1>
          <p className="text-sm text-gray-400 mb-8">
            {description}
          </p>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
