import { Config, defineConfig } from "drizzle-kit";

import { env } from "./env";

export default defineConfig({
    dialect: "postgresql",
    schema: "./database/schema/index.ts",
    out: "./database/migrations",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    verbose: true,
    strict: true,

} satisfies Config);
