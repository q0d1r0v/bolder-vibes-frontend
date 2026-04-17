"use client";

import { LogOut, Settings as SettingsIcon, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar } from "./avatar";
import { Dropdown, type DropdownItem } from "./dropdown";
import { useAuth } from "@/hooks/use-auth";

function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const items: DropdownItem[] = [
    {
      label: user?.email || "Profile",
      icon: <UserIcon className="h-4 w-4" />,
      onClick: () => {},
      disabled: true,
    },
    {
      label: "Settings",
      icon: <SettingsIcon className="h-4 w-4" />,
      onClick: () => router.push("/settings"),
    },
    {
      label: "Sign out",
      icon: <LogOut className="h-4 w-4" />,
      onClick: () => logout(),
      danger: true,
    },
  ];

  return (
    <Dropdown
      trigger={
        <button className="rounded-full transition-all hover:ring-2 hover:ring-accent/20">
          <Avatar name={user?.name || user?.email || null} size="md" />
        </button>
      }
      items={items}
      align="right"
    />
  );
}

export { UserMenu };
