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
      html: `
        <html>
          <head>
            <style>
              /* Add your CSS styles here */
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f0f0;
                padding: 20px;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
              }
              h1 {
                color: #333333;
              }
              p {
                color: #666666;
                line-height: 1.6;
              }
              .button {
                display: inline-block;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Hello ${session.user.name},</h1>
              <p>You've been invited to join Cubbie. Click the link below to sign up:</p>
              <a class="button" href="http://cubbie.io/auth/register">Join Cubbie</a>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send invite:", error);
    return { error: "An error occurred while sending the invite" };
  }
};
