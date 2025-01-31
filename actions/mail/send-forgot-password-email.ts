"use server";

import { env } from "@/env";
import { VERIFICATION_TOKEN_EXP_MIN } from "@/lib/constants";
import transport from "@/lib/nodemailer";

export async function sendForgotPasswordEmail({
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
    subject: "Reset Your Password - Zealer Hub",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #fefce8;">
        <table width="100%" cellpadding="0" cellspacing="0" style="min-width: 100%; background-color: #fefce8;">
          <tr>
            <td style="padding: 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(234, 179, 8, 0.1);">
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #eab308; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-family: Arial, sans-serif; color: #ffffff; font-size: 28px; font-weight: bold;">
                      Password Reset Request
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
                            We received a request to reset your password for your Authy account. Click the button below to reset your password.
                          </p>

                          <p style="margin: 0 0 20px; font-size: 16px; line-height: 24px;">
                            This password reset link will expire in <strong>${VERIFICATION_TOKEN_EXP_MIN} minutes</strong> for security reasons.
                          </p>
                        </td>
                      </tr>

                      <!-- Button -->
                      <tr>
                        <td style="padding: 30px 0; text-align: center;">
                          <a href="${env.NEXT_PUBLIC_APP_URL}/auth/forgot-password?token=${token}"
                             style="display: inline-block; padding: 14px 30px; background-color: #009933; color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; border-radius: 6px; transition: background-color 0.3s ease;">
                            Reset Your Password
                          </a>
                        </td>
                      </tr>

                      <!-- Security Notice -->
                      <tr>
                        <td style="padding: 20px; background-color: #fef3c7; border-radius: 6px;">
                          <p style="margin: 0 0 10px; font-family: Arial, sans-serif; color: #92400e; font-size: 14px; line-height: 20px;">
                            <strong>Security Notice:</strong>
                          </p>
                          <p style="margin: 0; font-family: Arial, sans-serif; color: #92400e; font-size: 14px; line-height: 20px;">
                            If you didn't request a password reset, please ignore this email or contact our support team immediately. Someone may be trying to access your account.
                          </p>
                        </td>
                      </tr>

                      <!-- Additional Security Tips -->
                      <tr>
                        <td style="padding: 20px 0;">
                          <p style="margin: 0 0 15px; font-family: Arial, sans-serif; color: #1f2937; font-size: 14px; line-height: 20px;">
                            <strong>Security Tips:</strong>
                          </p>
                          <ul style="margin: 0; padding: 0 0 0 20px; font-family: Arial, sans-serif; color: #4b5563; font-size: 14px; line-height: 20px;">
                            <li style="margin-bottom: 8px;">Choose a strong, unique password</li>
                            <li style="margin-bottom: 8px;">Never share your password with anyone</li>
                            <li>Enable two-factor authentication if available</li>
                          </ul>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px; background-color: #fef3c7; border-radius: 0 0 8px 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: center;">
                          <p style="margin: 0 0 10px; font-family: Arial, sans-serif; color: #92400e; font-size: 14px; line-height: 20px;">
                            Need help? Contact our support team
                          </p>
                          <p style="margin: 0; font-family: Arial, sans-serif; color: #92400e; font-size: 12px;">
                            &copy; ${new Date().getFullYear()} Authy. All rights reserved.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Additional Footer Note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto 0;">
                <tr>
                  <td style="text-align: center; font-family: Arial, sans-serif; color: #92400e; font-size: 12px; line-height: 18px;">
                    This is an automated message, please do not reply to this email.
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