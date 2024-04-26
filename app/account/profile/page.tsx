import { auth } from "@/auth";
import Account from "@/components/profile/Account";
import Header from "@/components/profile/Header";
import { Session } from "@/types/AppTypes";
import React from "react";
import styles from "@/components/profile/profile.module.css";

export default async function Profile() {
  const session = (await auth()) as Session;

  return (
    <div
      className={`${styles.layout} gap-6 w-full justify-center items center`}
    >
      <Header />
      <Account session={session} />
    </div>
  );
}
