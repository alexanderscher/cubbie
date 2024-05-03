"use server";
import { deleteUploadThingImage } from "@/actions/uploadthing/deletePhoto";
import { handleUpload } from "@/actions/uploadthing/uploadPhoto";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { Session } from "@/types/Session";
import { ReceiptType } from "@/types/ReceiptTypes";
import moment from "moment";
import "moment-timezone";

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
};

export const editReceipt = async (
  params: {
    id: string;
    values: ExtendedReceiptType;
  },
  receipt: ReceiptType
) => {
  const session = (await auth()) as Session;
  const { id } = params;
  const sessionUserId = session?.user?.id as string;
  const timezone = session.user.timezone || "America/Detroit";

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
    } = params.values;

    const uploadedFileKeys = [];

    let receiptFileUrl = "";
    let receiptFileKey = "";
    if (edit_image) {
      const uploadResults = await handleUpload(edit_image);
      if (uploadResults.length > 0) {
        receiptFileUrl = uploadResults[0].url;
        receiptFileKey = uploadResults[0].key;
        uploadedFileKeys.push(receiptFileKey);
      }
      if (receipt_image_key) {
        await deleteUploadThingImage(receipt_image_key);
      }
    }

    if (receipt_image_url === "" && receipt_image_key !== "") {
      await deleteUploadThingImage(receipt_image_key as string);
    }

    const expired = moment
      .tz(return_date, timezone)
      .startOf("day")
      .isBefore(moment.tz(timezone).startOf("day"));

    await prisma.receipt.update({
      where: {
        id: parseInt(params.id),
      },
      data: {
        type,
        store,
        card,
        receipt_image_url:
          receiptFileUrl === "" ? receipt_image_url : receiptFileUrl,
        receipt_image_key:
          receiptFileUrl === "" ? receipt_image_key : receiptFileKey,
        tracking_number,
        purchase_date: moment.tz(purchase_date, timezone).toISOString(),
        return_date: moment.tz(return_date, timezone).toISOString(),
        days_until_return: moment
          .tz(return_date, timezone)
          .diff(moment.tz(timezone), "days"),
        expired: expired,
      },
    });

    const receipt = await prisma.receipt.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        project: {
          include: {
            user: {
              include: {
                alertSettings: {
                  include: {
                    timezone: true,
                  },
                },
              },
            },
            projectUsers: {
              include: {
                user: {
                  include: {
                    alertSettings: {
                      include: {
                        timezone: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (receipt) {
      const { project } = receipt;
      const projectOwner = project.user; // This is the project owner
      const projectUsers = project.projectUsers.map((pu) => pu.user);
      const allUsers = [projectOwner, ...projectUsers];

      await prisma.alert.deleteMany({
        where: {
          projectId: project.id,
          receiptId: receipt.id,
        },
      });

      const alertsToCreate = [];
      for (const user of allUsers) {
        console.log(user.id, "USERID");
        const { alertSettings } = user as UserReceiptUpdate;
        if (alertSettings && alertSettings.timezone) {
          const userTimezone = alertSettings.timezone.value;
          const today = moment.tz(userTimezone);
          const returnDate = moment.tz(receipt.return_date, userTimezone);
          const daysUntilReturn = returnDate.diff(today, "days");

          if (alertSettings.notifyInOneWeek && daysUntilReturn === 6) {
            alertsToCreate.push({
              userId: user.id,
              date: returnDate.clone().subtract(7, "days").toDate(),
              type: "1_WEEK_REMINDER",
              receiptId: receipt.id,
              projectId: project.id,
            });
          }
          if (alertSettings.notifyInOneDay && daysUntilReturn === 1) {
            alertsToCreate.push({
              userId: user.id,
              date: returnDate.clone().subtract(1, "days").toDate(),
              type: "1_DAY_REMINDER",
              receiptId: receipt.id,
              projectId: project.id,
            });
          }
          if (alertSettings.notifyToday && daysUntilReturn === 0) {
            alertsToCreate.push({
              userId: user.id,
              date: today.toDate(),
              type: "TODAY_REMINDER",
              receiptId: receipt.id,
              projectId: project.id,
            });
          }
        }
      }

      console.log(alertsToCreate, "ALERTS TO CREATE");

      await Promise.all(
        alertsToCreate.map((alert) =>
          prisma.alert.create({
            data: alert,
          })
        )
      );
    }
  } catch (error) {
    console.log(error);
    return { error: "An error occured" };
  }
};
