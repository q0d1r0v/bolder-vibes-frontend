"use client";

import { useState } from "react";
import { MoreVertical, Shield, ShieldOff, Trash2 } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Badge } from "@/components/ui/badge";
import { Dropdown, type DropdownItem } from "@/components/ui/dropdown";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useUpdateUser, useDeleteUser } from "@/hooks/queries/use-users";
import type { User } from "@/types";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleToggleRole = (user: User) => {
    updateUser.mutate({
      id: user.id,
      data: { role: user.role === "ADMIN" ? "USER" : "ADMIN" },
    });
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteUser.mutate(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/[0.04] rounded-2xl border border-border-subtle overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle bg-white/[0.03]">
              <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">
                Name
              </th>
              <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">
                Email
              </th>
              <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">
                Role
              </th>
              <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">
                Created
              </th>
              <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const menuItems: DropdownItem[] = [
                {
                  label:
                    user.role === "ADMIN"
                      ? "Remove Admin"
                      : "Make Admin",
                  icon:
                    user.role === "ADMIN" ? (
                      <ShieldOff className="h-4 w-4" />
                    ) : (
                      <Shield className="h-4 w-4" />
                    ),
                  onClick: () => handleToggleRole(user),
                },
                {
                  label: "Delete",
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: () => setDeleteTarget(user),
                  danger: true,
                },
              ];

              return (
                <tr
                  key={user.id}
                  className="border-b border-border-subtle last:border-0 hover:bg-white/[0.06]"
                >
                  <td className="px-6 py-4 text-sm font-medium text-text-primary">
                    {user.name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={user.role === "ADMIN" ? "default" : "outline"}
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dropdown
                      trigger={
                        <IconButton size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </IconButton>
                      }
                      items={menuItems}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete user"
          description={`Are you sure you want to delete "${deleteTarget.email}"? This action cannot be undone.`}
          confirmLabel="Delete"
          loading={deleteUser.isPending}
          danger
        />
      )}
    </>
  );
}
