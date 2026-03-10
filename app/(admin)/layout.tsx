"use client";

import { DashboardHeader } from "@/components/layouts/dashboard-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
