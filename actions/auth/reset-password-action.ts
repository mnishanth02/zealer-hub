"use server";

import argon2 from "argon2";
import { eq } from "drizzle-orm";
import db from "@/database/db";
import { users, verificationTokens } from "@/database/schema";
import { findUserByEmail } from "@/data-access/auth.queries";
import { deleteVerificationTokenByIdentifier, findVerificationTokenByToken } from "@/data-access/verification-token-queries";
import { ResetPasswordSchema } from '@/validators/auth.validators';
import { lower } from '@/database/schema/auth.schema';

type Res =
  | { success: true }
  | { success: false; error: Record<string, string[]>; statusCode: 400 }
  | { success: false; error: string; statusCode: 401 | 500 };

export async function resetPasswordAction(
  email: (typeof users.$inferSelect)["email"],
  token: (typeof verificationTokens.$inferSelect)["token"],
  values: unknown,
): Promise<Res> {
  const parsedValues = ResetPasswordSchema.safeParse(values)

  if (!parsedValues.success) {
    const flatErrors = parsedValues.error.flatten();
    const formattedErrors: Record<string, string[]> = Object.fromEntries(
      Object.entries(flatErrors.fieldErrors).map(([key, value]) => [key, value || []])
    );
    return { success: false, error: formattedErrors, statusCode: 400 };
  }

  const password = parsedValues.data.password;

  const existingToken = await findVerificationTokenByToken(token);


  if (!existingToken?.expires) {
    //  delete expired token from the table
    await deleteVerificationTokenByIdentifier(email)

    return {
      success: false,
      error: "Token is invalid",
      statusCode: 401,
    };
  }

  if (new Date(existingToken.expires) < new Date()) {
    await deleteVerificationTokenByIdentifier(email)
    return {
      success: false,
      error: "Token is expired",
      statusCode: 401,
    };
  }

  const existingUser = await findUserByEmail(email);

  if (
    !existingUser?.password ||
    existingUser.email !== existingToken.identifier
  ) {
    return {
      success: false,
      error: "Oops, something went wrong",
      statusCode: 401,
    };
  }

  try {
    const hashedPassword = await argon2.hash(password);

    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));

    await deleteVerificationTokenByIdentifier(email)
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
