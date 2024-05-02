"use server";
import { auth } from "@/auth";
import { resend } from "@/lib/mail";
import { Session } from "@/types/Session";

export const sendInvite = async (email: string): Promise<any> => {
  const session = (await auth()) as Session;
  const userId = session?.user?.id as string;
  try {
    await resend.emails.send({
      from: "noreply@cubbie.io",
      to: email,
      subject: `Join ${session.user.name} on Cubbie!`,
      html: `<p>
      You've been invited to join Cubbie. Click the link below to sign up.

      http://cubbie.io/auth/register
</p>`,
    });
  } catch (error) {
    console.error("Failed to send invite:", error);
    return { error: "An error occurred while sending the invite" };
  }
};
