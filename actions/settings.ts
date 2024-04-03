"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { EmailSchema, PasswordSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import prisma from "@/prisma/client";

export const changeEmail = async (values: z.infer<typeof EmailSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  if (user.id) {
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    // if (user.isOAuth) {
    //   values.email = undefined;
    //   values.password = undefined;
    //   values.newPassword = undefined;
    //   values.isTwoFactorEnabled = undefined;
    // }

    if (values.name && values.name !== user.name) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          name: values.name,
        },
      });
      if (!values.email) {
        return { success: "Settings Updated!" };
      }
    }

    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);

      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" };
      }

      const verificationToken = await generateVerificationToken(values.email);
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return { success: "Verification email sent!" };
    }

    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      },
    });

    return { success: "Settings Updated!" };
  }
};

export const changePassword = async (
  values: z.infer<typeof PasswordSchema>
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }
  if (user.id) {
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
      return { error: "Unauthorized" };
    }

    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password
      );

      if (!passwordsMatch) {
        return { error: "Incorrect password!" };
      }

      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      values.password = hashedPassword;
      values.newPassword = undefined;
    }

    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      },
    });

    return { success: "Settings Updated!" };
  }
};
