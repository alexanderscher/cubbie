import { resend } from "@/lib/mail";
import prisma from "@/prisma/client";
import moment from "moment";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const domain = "http://localhost:3000";

export async function GET() {
  const today = moment.utc().startOf("day");
  const startOfNextDay = today.add(1, "days").startOf("day");
  const endOfNextDay = moment(startOfNextDay).endOf("day");

  const receipts = await prisma.receipt.findMany({
    where: {
      return_date: {
        gte: startOfNextDay.toDate(),
        lte: endOfNextDay.toDate(),
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
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: user.email,
          subject: "Receipt Due Tomorrow",
          html: `<p>Your receipt from <a href="${link}">${receipt.store}</a> is due tomorrow.</p>`,
        });

        await prisma.alerts.create({
          data: {
            userId: user.id,
            type: "1_DAY_REMINDER",
            receipt_id: receipt.id,
            date: new Date(),
          },
        });
      }
    })
  );

  return NextResponse.json({ receipts });
}
