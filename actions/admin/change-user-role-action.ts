"use server";

import { auth } from "@/auth";
import { findUserByEmail } from "@/data-access/auth.queries";
import db from "@/database/db";
import { users } from "@/database/schema";
import { USER_ROLES } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ADMIN PANEL ACTION
export async function changeUserRoleAction(
  email: (typeof users.$inferSelect)["email"],
  newRole: (typeof users.$inferSelect)["role"],
) {
  const session = await auth();

  if (session?.user?.role !== USER_ROLES.ADMIN) {
    throw new Error("Unauthorized");
  }

  const existingUser = await findUserByEmail(email);

  if (!existingUser?.id) return;
  if (existingUser.role === "ADMIN") return;
  if (existingUser.role === newRole) return;

  await db
    .update(users)
    .set({ role: newRole })
    .where(eq(users.id, existingUser.id));

  revalidatePath("/profile/admin-panel");
}
