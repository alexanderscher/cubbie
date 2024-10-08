import { resend } from "@/lib/mail";
import prisma from "@/prisma/client";
import moment from "moment";
import { NextRequest } from "next/server";
const url = process.env.NEXT_PUBLIC_URL;

const sendReminder = async (daysUntilDue: number, reminderType: string) => {
  try {
    const today = moment.utc().startOf("day");
    let startOfPeriod, endOfPeriod;

    if (daysUntilDue === 0) {
      startOfPeriod = today;
      endOfPeriod = moment(today).endOf("day");
    } else {
      startOfPeriod = today.clone().add(daysUntilDue, "days").startOf("day");
      endOfPeriod = moment(startOfPeriod).endOf("day");
    }

    const receipts = await prisma.receipt.findMany({
      where: {
        return_date: {
          gte: startOfPeriod.toDate(),
          lte: endOfPeriod.toDate(),
        },
      },
      orderBy: {
        return_date: "desc",
      },
      include: {
        project: {
          include: {
            projectUsers: true,
          },
        },
      },
    });

    await Promise.all(
      receipts.map(async (receipt) => {
        // Fetch the project owner with planId to check if they are eligible
        const projectOwner = await prisma.user.findUnique({
          where: {
            id: receipt.project.userId,
          },
          select: { id: true, email: true, planId: true }, // Include planId to check
        });

        // If the project owner's planId is 1, do not proceed with sending emails or alerts
        if (projectOwner?.planId === 1 || projectOwner?.planId === null) {
          return;
        }

        // Fetch other project users without checking planId
        const projectUsers = await Promise.all(
          receipt.project.projectUsers.map((pu) =>
            prisma.user.findUnique({
              where: {
                id: pu.userId,
              },
              select: { id: true, email: true }, // Fetch only necessary fields
            })
          )
        );

        const validUsers = projectUsers.filter((user) => user !== null);

        await Promise.all(
          validUsers.map(async (user) => {
            if (user && user.email) {
              const link = `${url}/receipt/${receipt.id}`;
              let emailSubject = "Receipt Reminder";
              let date = "";

              switch (reminderType) {
                case "TODAY_REMINDER":
                  emailSubject = "Your Receipt is Due Today";
                  date = "today";
                  break;
                case "1_DAY_REMINDER":
                  emailSubject = "Your Receipt is Due Tomorrow";
                  date = "tomorrow";
                  break;
                case "1_WEEK_REMINDER":
                  emailSubject = "Your Receipt is Due Next Week";
                  date = "in one week";
                  break;
              }

              await resend.emails.send({
                from: "noreply@cubbie.io",
                to: user.email,
                subject: emailSubject,
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
              <p>Your receipt from <a href="${link}">${receipt.store}</a> is due ${date}.</p>
   
            </div>
          </body>
        </html>
                
                `,
              });

              await prisma.alert.create({
                data: {
                  userId: user.id,
                  type: reminderType,
                  receiptId: receipt.id,
                  projectId: receipt.project_id,
                  date: new Date(),
                },
              });
            }
          })
        );
      })
    );
  } catch (error) {
    console.error("Failed to send reminders:", error);
  }
};

export const revalidate = 0;

export async function GET(request: NextRequest) {
  // const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response("Unauthorized", {
  //     status: 401,
  //   });
  // }
  try {
    await sendReminder(0, "TODAY_REMINDER");
    await sendReminder(1, "1_DAY_REMINDER");
    await sendReminder(7, "1_WEEK_REMINDER");
    return new Response(
      JSON.stringify({ message: "Reminders sent successfully." }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending reminders:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
