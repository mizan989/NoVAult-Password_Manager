import { Resend } from "resend";
import crypto from "crypto";
import { env } from "../config/env";

const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export function generateOtpCode(): string {
  // 6-digit numeric OTP
  return crypto.randomInt(100000, 999999).toString();
}

export function hashOtpCode(code: string): string {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function sendOtpEmail(to: string, code: string): Promise<void> {
  const subject = "Your NoVAult verification code";
  const html = `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color:#111;">NoVAult</h2>
      <p>Your verification code is:</p>
      <p style="font-size: 28px; letter-spacing: 6px; font-weight: 700;">${code}</p>
      <p style="color:#666; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>
  `;

  if (!resend) {
    // Dev fallback - no email provider configured
    console.log(`[NoVAult][dev-email] OTP for ${to}: ${code}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: env.emailFrom,
      to,
      subject,
      html,
    });

    if (error) {
      console.error(`[NoVAult][email-error] Failed to send OTP to ${to}:`, error);
      // In development or if domain unverified, log code to console so testing is not blocked
      if (!env.isProd) {
        console.log(`[NoVAult][dev-otp-fallback] OTP for ${to}: ${code}`);
      }
    } else {
      console.log(`[NoVAult][email-sent] OTP sent to ${to} (id: ${data?.id})`);
    }
  } catch (err) {
    console.error(`[NoVAult][email-exception] Exception sending OTP to ${to}:`, err);
    if (!env.isProd) {
      console.log(`[NoVAult][dev-otp-fallback] OTP for ${to}: ${code}`);
    }
  }
}
