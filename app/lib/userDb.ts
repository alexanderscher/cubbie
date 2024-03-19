"use server";
import prisma from "@/prisma/client";

export const getUserByEmail = async (email: string) => {
  if (!email) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  console.log("USER!!!!!!!", user);

  return user;
};
