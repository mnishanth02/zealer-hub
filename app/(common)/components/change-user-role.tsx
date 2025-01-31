"use client";

import React, { useTransition } from "react";

import { changeUserRoleAction } from "@/actions/admin/change-user-role-action";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { users } from "@/database/schema";
import { USER_ROLES } from "@/lib/constants";

type ChangeUserRoleInputProps = {
  email: (typeof users.$inferSelect)["email"];
  currentRole: (typeof users.$inferSelect)["role"];
  isAdmin: boolean;
};

export const ChangeUserRoleInput = ({ email, currentRole, isAdmin }: ChangeUserRoleInputProps) => {
  const [isPending, startTransition] = useTransition();

  const changeHandler = (email: string, value: String) => {
    const newRole = value as (typeof users.$inferSelect)["role"];

    if (newRole === currentRole) return;

    startTransition(async () => {
      await changeUserRoleAction(email, newRole);
    });
  };

  return (
    <Select
      disabled={isAdmin || isPending}
      value={currentRole}
      onValueChange={(value: USER_ROLES) => changeHandler(email, value)}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="USER">User</SelectItem>
          <SelectItem value="ADMIN">Admin</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
