import { auth } from "@/auth";
import { Session } from "@/types/AppTypes";

export const currentUser = async () => {
  const session = (await auth()) as Session;

  return session?.user;
};

export const currentRole = async () => {
  const session = (await auth()) as Session;

  return session?.user?.role;
};
