import prisma from "@/prisma/client";
import { revalidateTag } from "next/cache";

export function revalidateUsersInProject(projectId: number) {
  prisma.projectUser
    .findMany({
      where: {
        projectId: projectId,
      },
      select: {
        userId: true,
      },
    })
    .then((projectUsers) => {
      projectUsers.forEach((projectUser) => {
        try {
          console.log(`Revalidating user ${projectUser.userId}`);
          revalidateTag(`projects_user_${projectUser.userId}`);
        } catch (err) {
          console.error(
            `Failed to revalidate user ${projectUser.userId}:`,
            err
          );
        }
      });
    })
    .catch((err) => {
      console.error("Error fetching project users:", err);
    });
}
