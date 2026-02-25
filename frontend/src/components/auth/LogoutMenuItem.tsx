"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/actions/auth.actions";

export function LogoutMenuItem() {
  const [isPending, startTransition] = useTransition();
  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <DropdownMenuItem
      className="text-red-600 dark:text-red-400 cursor-pointer flex w-full items-center"
      onSelect={(e) => {
        e.preventDefault();
        handleLogout();
      }}
      disabled={isPending}
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>{isPending ? "Logging out..." : "Log out"}</span>
    </DropdownMenuItem>
  );
}
