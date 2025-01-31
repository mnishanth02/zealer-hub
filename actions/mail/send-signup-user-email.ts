"use server";

import { env } from "@/env";
import { VERIFICATION_TOKEN_EXP_MIN } from "@/lib/constants";
import transport from "@/lib/nodemailer";

export async function sendSignupUserEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  console.log(`Sending email to ${email} with token ${token}`);

  await transport.sendMail({
    from: `"Zealer Hub" <${env.NODEMAILER_GOOGLE_SMTP_USER}>`,
    to: email,
    subject: "Welcome to Zealer Hub - Verify Your Email",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify your email address</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f5;">
        <table width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%; background-color: #f4f4f5;">
          <tr>
            <td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #3b82f6; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-family: Arial, sans-serif; color: #ffffff; font-size: 28px; font-weight: bold;">
                      Zealer Hub
                    </h1>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-family: Arial, sans-serif; color: #1f2937;">
                          <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px;">Hi there,</p>

                          <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px;">
                            Welcome to Zealer Hub! We're excited to have you join our community. To get started, please verify your email address by clicking the button below.
                          </p>

                          <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px;">
                            This verification link will expire in <strong>${VERIFICATION_TOKEN_EXP_MIN} minutes</strong>.
                          </p>
                        </td>
                      </tr>

                      <!-- Button -->
                      <tr>
                        <td style="padding: 30px 0; text-align: center;">
                          <a href="${env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${token}"
                             style="display: inline-block; padding: 14px 30px; background-color: #009933; color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; border-radius: 6px; transition: background-color 0.3s ease;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>

                      <!-- Security Notice -->
                      <tr>
                        <td style="padding: 20px; background-color: #f8fafc; border-radius: 6px;">
                          <p style="margin: 0; font-family: Arial, sans-serif; color: #64748b; font-size: 14px; line-height: 20px;">
                            If you didn't create an account with Zealer Hub, you can safely ignore this email.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #f8fafc; border-radius: 0 0 8px 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: center;">
                          <p style="margin: 0 0 10px; font-family: Arial, sans-serif; color: #64748b; font-size: 14px; line-height: 20px;">
                            Need help? Contact our support team
                          </p>
                          <p style="margin: 0; font-family: Arial, sans-serif; color: #94a3b8; font-size: 12px;">
                            &copy; ${new Date().getFullYear()} Zealer Hub. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    `,
  });

  console.log(`Email sent to ${email} with token ${token}`);
}