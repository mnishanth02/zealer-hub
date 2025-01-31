"use server";

import argon2 from "argon2";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { USER_ROLES } from "@/lib/constants";
import { sendSignupUserEmail } from "@/actions/mail/send-signup-user-email";
import db from "@/database/db";
import { lower } from "@/database/schema/auth.schema";
import { createVerificationTokenAction } from "./create-verification-token-action";
import { findAdminUserEmailAddresses } from "@/data-access/admin-user-email-address-queries";
import { SignupSchema } from "@/validators/auth.validators";

type Res =
  | { success: true }
  | { success: false; error: Record<string, string[]>; statusCode: 400 }
  | { success: false; error: string; statusCode: 409 | 500 };

export async function signupUserAction(values: unknown): Promise<Res> {
  const parsedValues = SignupSchema.safeParse(values);
  if (!parsedValues.success) {
    const flatErrors = parsedValues.error.flatten();
    const formattedErrors: Record<string, string[]> = Object.fromEntries(
      Object.entries(flatErrors.fieldErrors).map(([key, value]) => [key, value || []])
    );
    return { success: false, error: formattedErrors, statusCode: 400 };
  }

  const { name, email, password } = parsedValues.data;

  try {
    const existingUser = await db
      .select({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(eq(lower(users.email), email.toLowerCase()))
      .then((res) => res[0] ?? null);

    if (existingUser?.id) {
      if (!existingUser.emailVerified) {
        const verificationToken = await createVerificationTokenAction(
          existingUser.email,
        );

        await sendSignupUserEmail({
          email: existingUser.email,
          token: verificationToken.token,
        });

        return {
          success: false,
          error: "User exists but not verified. Verification link resent",
          statusCode: 409,
        };
      } else {
        return {
          success: false,
          error: "Email already exists",
          statusCode: 409,
        };
      }
    }
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }

  try {
    const hashedPassword = await argon2.hash(password);
    const adminEmails = await findAdminUserEmailAddresses();
    const isAdmin = adminEmails.includes(email.toLowerCase());

    const newUser = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: isAdmin ? "ADMIN" : "USER"
      })
      .returning({
        id: users.id,
        email: users.email,
        emailVerified: users.emailVerified,
      })
      .then((res) => res[0]);

    const verificationToken = await createVerificationTokenAction(
      newUser.email,
    );

    await sendSignupUserEmail({
      email: newUser.email,
      token: verificationToken.token,
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
