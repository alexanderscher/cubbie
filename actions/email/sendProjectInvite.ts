"use server";
import { auth } from "@/auth";
import { resend } from "@/lib/mail";
import { Session } from "@/types/Session";
import { Project } from "@prisma/client";

export const sendProjectInvite = async (
  email: string,
  project: Project
): Promise<any> => {
  const session = (await auth()) as Session;
  try {
    await resend.emails.send({
      from: "noreply@cubbie.io",
      to: email,
      subject: `Added to ${project.name}`,
      html: `<p>
      ${session.user.email} has invited you to join 
      <a href="http://cubbie.io/project/${project.id}">${project.name}</a> 
      . 
</p>`,
    });
  } catch (error) {
    console.error("Failed to send invite:", error);
    return { error: "An error occurred while sending the invite" };
  }
};
