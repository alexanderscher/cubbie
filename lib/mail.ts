import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
const url = process.env.NEXT_PUBLIC_URL;

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "noreply@cubbie.io",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${url}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: "noreply@cubbie.io",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${url}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "noreply@cubbie.io",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};
