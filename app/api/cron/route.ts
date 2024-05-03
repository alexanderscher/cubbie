import { resend } from "@/lib/mail";
import prisma from "@/prisma/client";
import { getBaseUrl } from "@/utils/baseUrl";
import moment from "moment";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const domain = getBaseUrl();

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
        const projectUserPromise = prisma.user.findUnique({
          where: {
            id: receipt.project.userId,
          },
        });

        const projectUsersPromises = receipt.project.projectUsers.map((pu) =>
          prisma.user.findUnique({
            where: {
              id: pu.userId,
            },
          })
        );

        const users = await Promise.all([
          projectUserPromise,
          ...projectUsersPromises,
        ]);

        const validUsers = users.filter((user) => user !== null);

        await Promise.all(
          validUsers.map(async (user) => {
            if (user?.email) {
              const link = `${domain}/receipt/${receipt.id}`;
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
                html: `<p>Your receipt from <a href="${link}">${receipt.store}</a> is due ${date}.</p>`,
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
    revalidateTag(`alerts`);
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
