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
        project: true,
      },
    });

    await Promise.all(
      receipts.map(async (receipt) => {
        const user = await prisma.user.findUnique({
          where: {
            id: receipt.project.userId,
          },
        });

        if (user?.email) {
          const link = `${domain}/receipt/${receipt.id}`;
          let emailSubject = "Receipt Reminder";
          if (reminderType === "TODAY_REMINDER") {
            emailSubject = "Your Receipt is Due Today";
          } else if (reminderType === "1_DAY_REMINDER") {
            emailSubject = "Your Receipt is Due Tomorrow";
          } else if (reminderType === "1_WEEK_REMINDER") {
            emailSubject = "Your Receipt is Due Next Week";
          }

          await resend.emails.send({
            from: "noreply@cubbie.io",
            to: user.email,
            subject: emailSubject,
            html: `<p>Your receipt from <a href="${link}">${receipt.store}</a> is due.</p>`,
          });

          await prisma.alerts.create({
            data: {
              userId: user.id,
              type: reminderType,
              receipt_id: receipt.id,
              date: new Date(),
            },
          });
        }
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
