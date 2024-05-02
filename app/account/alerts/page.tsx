import { auth } from "@/auth";
import Header from "@/components/profile/Header";
import { UserAlerts } from "@/types/AppTypes";
import React from "react";
import styles from "@/components/profile/profile.module.css";
import AlertSettings from "@/components/profile/AlertSetting";
import { getUserInfo } from "@/lib/userDb";

const getUser = async () => {
  const user = await getUserInfo();
  return user as UserAlerts;
};

export default async function Alerts() {
  const user = await getUser();

  return (
    <div
      className={`${styles.layout} gap-6 w-full justify-center items center `}
    >
      <Header />
      <AlertSettings user={user} />
    </div>
  );
}
