"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/actions/uploadthing/uploadPhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { ReceiptType } from "@/types/ReceiptTypes";
import moment from "moment";

interface UserReceiptUpdate {
  id: string;
  name: string;
  email: string;
  emailVerified: Date;
  image: string;
  password: string;
  role: string;
  accounts: any;
  isTwoFactorEnabled: boolean;
  phone: string;
  twoFactorConfirmation: string;
  projects: any;
  projectOwnerships: any;
  alerts: any;
  projectUsers: any;
  alertRead: any;
  projectUserArchive: any;
  alertSettings: any;
}

type ExtendedReceiptType = ReceiptType & {
  edit_image: string;
  timezone: string;
};
export const editReceipt = async (params: {
  id: string;
  values: ExtendedReceiptType;
}) => {
  const session = await auth();
  const sessionUserId = session?.user?.id;

  if (!sessionUserId) {
    return { error: "Unauthorized" };
  }

  try {
    const {
      type,
      store,
      card,
      receipt_image_url,
      receipt_image_key,
      tracking_number,
      purchase_date,
      return_date,
      edit_image,
      timezone, // Now extracting timezone from the values
    } = params.values;

    let receiptFileUrl = receipt_image_url;
    let receiptFileKey = receipt_image_key;
    if (edit_image) {
      const uploadResults = await handleUpload(edit_image);
      if (uploadResults.length > 0) {
        receiptFileUrl = uploadResults[0].url;
        receiptFileKey = uploadResults[0].key;
        if (receipt_image_key) {
          await deleteUploadThingImage(receipt_image_key);
        }
      }
    }
    const today = moment.tz(timezone).startOf("day");
    const returnDate = moment.tz(return_date, timezone).startOf("day");
    const utcPurchaseDate = moment.utc(purchase_date);

    const daysUntilReturn = returnDate.diff(today, "days");

    const isExpired = returnDate.isBefore(today);

    await prisma.receipt.update({
      where: { id: parseInt(params.id) },
      data: {
        type,
        store,
        card,
        receipt_image_url: receiptFileUrl,
        receipt_image_key: receiptFileKey,
        tracking_number,
        purchase_date: utcPurchaseDate.toISOString(),
        return_date: returnDate.toISOString(),
        days_until_return: daysUntilReturn,
        expired: isExpired,
      },
    });

    const receiptWithDetails = await prisma.receipt.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        project: {
          include: {
            user: {
              include: {
                alertSettings: true,
              },
            },
            projectUsers: {
              include: {
                user: {
                  include: {
                    alertSettings: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (receiptWithDetails) {
      const { project } = receiptWithDetails;
      const allUsers = [
        project.user,
        ...project.projectUsers.map((pu) => pu.user),
      ];

      // Delete existing alerts related to this receipt
      await prisma.alert.deleteMany({
        where: {
          projectId: project.id,
          receiptId: receiptWithDetails.id,
        },
      });

      const alertsToCreate = [];

      for (const user of allUsers) {
        const today = moment.tz(timezone).startOf("day");
        const returnDate = moment.tz(return_date, timezone).startOf("day");

        const daysUntilReturn = returnDate.diff(today, "days");

        console.log(`Today's date (UTC): ${today.format()}`);
        console.log(`Return date (Local TZ): ${returnDate.format()}`);
        console.log(`Days until return: ${daysUntilReturn}`);

        if (user.alertSettings?.notifyInOneWeek && daysUntilReturn === 6) {
          alertsToCreate.push({
            userId: user.id,
            date: returnDate.toISOString(),
            type: "1_WEEK_REMINDER",
            receiptId: receiptWithDetails.id,
            projectId: project.id,
          });
        }
        if (user.alertSettings?.notifyInOneDay && daysUntilReturn === 1) {
          alertsToCreate.push({
            userId: user.id,
            date: returnDate.toISOString(),
            type: "1_DAY_REMINDER",
            receiptId: receiptWithDetails.id,
            projectId: project.id,
          });
        }
        if (user.alertSettings?.notifyToday && daysUntilReturn === 0) {
          alertsToCreate.push({
            userId: user.id,
            date: returnDate.toISOString(),
            type: "TODAY_REMINDER",
            receiptId: receiptWithDetails.id,
            projectId: project.id,
          });
        }
      }

      // Create new alerts
      // await Promise.all(
      //   alertsToCreate.map((alert) => prisma.alert.create({ data: alert }))
      // );
    }
  } catch (error) {
    console.error(error);
    return { error: "An error occurred" };
  }
};
