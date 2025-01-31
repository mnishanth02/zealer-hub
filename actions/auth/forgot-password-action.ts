"use server";

import { findUserByEmail } from "@/data-access/auth.queries";
import { createVerificationTokenAction } from "./create-verification-token-action";
import { sendForgotPasswordEmail } from "../mail/send-forgot-password-email";
import { ForgotPasswordSchema } from "@/validators/auth.validators";

type Res =
  | { success: true }
  | { success: false; error: Record<string, string[]>; statusCode: 400 }
  | { success: false; error: string; statusCode: 401 | 500 };

export async function forgotPasswordAction(values: unknown): Promise<Res> {
  const parsedValues = ForgotPasswordSchema.safeParse(values);

  if (!parsedValues.success) {
    const flatErrors = parsedValues.error.flatten();
    const formattedErrors: Record<string, string[]> = Object.fromEntries(
      Object.entries(flatErrors.fieldErrors).map(([key, value]) => [key, value || []])
    );
    return { success: false, error: formattedErrors, statusCode: 400 };
  }

  const email = parsedValues.data.email;

  try {
    const existingUser = await findUserByEmail(email);

    // this is a false positive, to deter malicious users
    if (!existingUser?.id) return { success: true };

    if (!existingUser.password) {
      return {
        success: false,
        error: "This user was created with OAuth, please sign in with OAuth",
        statusCode: 401,
      };
    }

    const verificationToken = await createVerificationTokenAction(
      existingUser.email,
    );

    await sendForgotPasswordEmail({
      email: existingUser.email,
      token: verificationToken.token,
    });

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
