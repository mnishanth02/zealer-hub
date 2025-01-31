import "server-only";

import nodemailer from "nodemailer";
import { env } from "@/env";

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: env.NODEMAILER_GOOGLE_SMTP_USER,
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        accessToken: env.NODEMAILER_GOOGLE_ACCESS_TOKEN,
        refreshToken: env.NODEMAILER_GOOGLE_REFRESH_TOKEN,
    },
});

export default transport;