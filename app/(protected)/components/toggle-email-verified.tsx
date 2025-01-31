"use client";

import React, { useTransition } from "react";

import { toggleEmailVerifiedAction } from "@/actions/admin/toggle-email-verified-action";
import { Switch } from "@/components/ui/switch";
import { users } from "@/database/schema";

type ToggleEmailVerifiedInputProps = {
  email: (typeof users.$inferSelect)["email"];
  emailVerified: (typeof users.$inferSelect)["emailVerified"];
  isAdmin: boolean;
};
users;

const ToggleEmailVerify = ({ email, emailVerified, isAdmin }: ToggleEmailVerifiedInputProps) => {
  const [isPending, startTransition] = useTransition();

  const clickHandler = (email: string, isCurrentlyVerified: boolean) => {
    startTransition(async () => {
      await toggleEmailVerifiedAction(email, isCurrentlyVerified);
    });
  };

  return (
    <div>
      <Switch
        disabled={isAdmin || isPending}
        checked={!!emailVerified}
        onCheckedChange={clickHandler.bind(null, email, !!emailVerified)}
      />
    </div>
  );
};

export default ToggleEmailVerify;
