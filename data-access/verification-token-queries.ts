import "server-only";

import db from "@/database/db";
import { verificationTokens } from "@/database/schema";
import { eq } from "drizzle-orm";
import { lower } from "@/database/schema/auth.schema";

export async function findVerificationTokenByToken(
  token: (typeof verificationTokens.$inferSelect)["token"],
): Promise<typeof verificationTokens.$inferSelect | null> {
  const verificationToken = await db
    .select()
    .from(verificationTokens)
    .where(eq(verificationTokens.token, token))
    .then((res) => res[0] ?? null);

  return verificationToken;
}


export async function deleteVerificationTokenByIdentifier(identifier: (typeof verificationTokens.$inferSelect)["identifier"]): Promise<void> {
  await db
    .delete(verificationTokens)
    .where(eq(lower(verificationTokens.identifier), identifier.toLowerCase()));
}