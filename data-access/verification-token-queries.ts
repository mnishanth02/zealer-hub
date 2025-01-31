import "server-only";

import db from "@/database/db";
import { verificationTokens } from "@/database/schema";
import { eq } from "drizzle-orm";

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
