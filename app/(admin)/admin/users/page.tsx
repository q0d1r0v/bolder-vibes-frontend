"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { UsersTable } from "@/components/admin/users-table";
import { useUsers } from "@/hooks/queries/use-users";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useUsers({ page, limit: 20 });

  const users = data?.data || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          User Management
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage users and their roles
        </p>
      </div>

      {!isLoading && users.length === 0 ? (
        <EmptyState
          icon={<Shield className="h-12 w-12" />}
          title="No users found"
          description="Users will appear here once they register."
        />
      ) : (
        <>
          <UsersTable users={users} isLoading={isLoading} />

          {data?.meta && data.meta.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={data.meta.totalPages}
              onPageChange={setPage}
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  );
}
