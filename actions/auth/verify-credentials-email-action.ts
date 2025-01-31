"use server";

import { findUserByEmail } from "@/data-access/auth.queries";
import { findVerificationTokenByToken } from "@/data-access/verification-token-queries";
import db from "@/database/db";
import { users, verificationTokens } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function verifyCredentialsEmailAction(
  token: (typeof verificationTokens.$inferSelect)["token"],
) {
  const verificationToken = await findVerificationTokenByToken(token);

  if (!verificationToken?.expires) return { success: false };

  if (new Date(verificationToken.expires) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    return { success: false };
  }

  const existingUser = await findUserByEmail(verificationToken.identifier);


  if (
    existingUser?.id &&
    !existingUser.emailVerified &&
    existingUser.email === verificationToken.identifier
  ) {
    await db
      .update(users)
      .set({ emailVerified: new Date() })
      .where(eq(users.id, existingUser.id));

    await db
      .update(verificationTokens)
      .set({ expires: new Date() })
      .where(eq(verificationTokens.identifier, existingUser.email));

    return { success: true };
  } else {
    return { success: false };
  }
}
