import "server-only";

import db from "@/database/db";
import { adminUserEmailAddresses } from "@/database/schema";
import { lower } from "@/database/schema/auth.schema";

export const findAdminUserEmailAddresses = async () => {
  const adminUserEmailAddress = await db
    .select({ email: lower(adminUserEmailAddresses.email) })
    .from(adminUserEmailAddresses);

  return adminUserEmailAddress.map((item) => item.email as string);
};
