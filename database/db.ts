import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { env } from "@/env";

const DATABASE_URL = env.DATABASE_URL;

const sql = neon(DATABASE_URL);

const db = drizzle(sql, { schema });

export default db;