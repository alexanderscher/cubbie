"use server";
import prisma from "@/prisma/client";
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

export const getProjects = unstable_cache(
  async () => {
    const session = await getServerSession(authOptions);
    const userId = parseInt(session?.user?.id as string);
    console.log(session);

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: {
        created_at: "desc",
      },
      include: {
        receipts: {
          include: {
            items: true,
          },
        },
      },
    });

    return projects;
  },
  ["projects"],
  { tags: ["projects"], revalidate: 60 }
);

export const getProjectById = unstable_cache(
  async (id: string) => {
    const session = await getServerSession(authOptions);
    const userId = parseInt(session?.user?.id as string);
    const project = await prisma.project.findUnique({
      where: {
        userId,
        id: parseInt(id),
      },
      include: {
        receipts: {
          include: {
            items: true,
          },
        },
      },
    });

    return project;
  },
  ["projects"],
  { tags: ["projects"], revalidate: 60 }
);

export const getReceipts = unstable_cache(
  async () => {
    const session = await getServerSession(authOptions);
    const userId = parseInt(session?.user?.id as string);

    const receipts = await prisma.receipt.findMany({
      where: {
        project: {
          userId: userId,
        },
      },
      include: {
        items: true,
        project: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return receipts;
  },
  ["receipts"],
  { tags: ["receipts"], revalidate: 60 }
);

export const getReceiptById = unstable_cache(
  async (id: string) => {
    const session = await getServerSession(authOptions);
    const userId = parseInt(session?.user?.id as string);
    const receipt = await prisma.receipt.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        items: true,
        project: true,
      },
    });

    return receipt;
  },
  ["receipts"],
  { tags: ["receipts"], revalidate: 60 }
);

export const getUserByEmail = async (email: string) => {
  if (!email) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};
