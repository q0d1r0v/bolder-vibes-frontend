"use client";

import { User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AccountSection() {
  const { user } = useAuth();
  return (
    <section className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-4 w-4 text-text-secondary" />
        <h2 className="text-base font-medium text-text-primary">Account</h2>
      </div>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 text-sm">
        <dt className="text-text-muted">Name</dt>
        <dd className="text-text-primary">{user?.name ?? "—"}</dd>
        <dt className="text-text-muted">Email</dt>
        <dd className="text-text-primary">{user?.email ?? "—"}</dd>
        <dt className="text-text-muted">Role</dt>
        <dd className="text-text-primary capitalize">
          {user?.role?.toLowerCase() ?? "—"}
        </dd>
      </dl>
    </section>
  );
}
