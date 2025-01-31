import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.string().min(1),
    AUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    NODEMAILER_GOOGLE_SMTP_USER: z.string(),
    NODEMAILER_GOOGLE_ACCESS_TOKEN: z.string(),
    NODEMAILER_GOOGLE_REFRESH_TOKEN: z.string()

    // STRAVA_CLIENT_ID: z.string().min(1),
    // STRAVA_CLIENT_SECRET: z.string().min(1),
    // EMAIL_FROM: z.string().min(1),
    // EMAIL_SERVER_HOST: z.string().min(1),
    // EMAIL_SERVER_PORT: z.string().min(1),
    // EMAIL_SERVER_USER: z.string().min(1),
    // EMAIL_SERVER_PASSWORD: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    // NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    // NEXT_PUBLIC_BUCKET_URL: z.string().url(),
    // NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY: z.string().min(1),
    // NEXT_PUBLIC_KNOCK_FEED_ID: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NODEMAILER_GOOGLE_SMTP_USER: process.env.NODEMAILER_GOOGLE_SMTP_USER,
    NODEMAILER_GOOGLE_ACCESS_TOKEN: process.env.NODEMAILER_GOOGLE_ACCESS_TOKEN,
    NODEMAILER_GOOGLE_REFRESH_TOKEN: process.env.NODEMAILER_GOOGLE_REFRESH_TOKEN
    // STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
    // STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
    // EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    // EMAIL_FROM: process.env.EMAIL_FROM,
    // EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    // EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    // EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
  },

  emptyStringAsUndefined: true,
});
