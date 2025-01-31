"use server";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { users } from '@/database/schema';
import db from '@/database/db';
import { UpdateUserInfoSchema } from "@/validators/auth.validators";

type Res =
  | {
    success: true;
    data: {
      id: (typeof users.$inferSelect)["id"];
      name: (typeof users.$inferSelect)["name"];
    };
  }
  | { success: false; error: Record<string, string[]>; statusCode: 400 }
  | { success: false; error: string; statusCode: 401 | 500 };

export async function updateUserInfoAction(values: unknown): Promise<Res> {
  const parsedValues = UpdateUserInfoSchema.safeParse(values)

  if (!parsedValues.success) {
    const flatErrors = parsedValues.error.flatten();
    const formattedErrors: Record<string, string[]> = Object.fromEntries(
      Object.entries(flatErrors.fieldErrors).map(([key, value]) => [key, value || []])
    );
    return { success: false, error: formattedErrors, statusCode: 400 };
  }

  const { id, name } = parsedValues.data;

  const session = await auth();

  if (!session?.user?.id || session.user.id !== id) {
    return { success: false, error: "Unauthorized", statusCode: 401 };
  }

  if (session.user.name === name) {
    return { success: true, data: { id, name } };
  }

  try {
    const updatedUser = await db
      .update(users)
      .set({ name })
      .where(eq(users.id, id))
      .returning({ id: users.id, name: users.name })
      .then((res) => res[0]);

    return { success: true, data: updatedUser };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }
}
