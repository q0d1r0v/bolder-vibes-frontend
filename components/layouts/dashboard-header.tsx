"use client";

import { Logo } from "@/components/ui/logo";
import { UserMenu } from "@/components/ui/user-menu";

export function DashboardHeader() {
  return (
    <header className="h-16 border-b border-border-subtle bg-white/80 backdrop-blur-sm px-6 flex items-center justify-between sticky top-0 z-30">
      <Logo />
      <UserMenu />
    </header>
  );
}
