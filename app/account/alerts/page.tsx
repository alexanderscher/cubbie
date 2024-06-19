import Header from "@/components/profile/Header";
import { UserAlerts } from "@/types/AppTypes";
import React from "react";
import styles from "@/components/profile/profile.module.css";
import AlertSettings from "@/components/profile/AlertSetting";
import { getUserInfo } from "@/lib/userDb";
import { Session } from "@/types/Session";
import { auth } from "@/auth";
import { SubscribeForAlerts } from "@/components/profile/SubscribeForAlerts";

const getUser = async () => {
  const user = await getUserInfo();
  return user as UserAlerts;
};

export default async function Alerts() {
  const user = await getUser();
  const session = (await auth()) as Session;

  return (
    <div className={`${styles.layout} gap-6 w-full justify-start `}>
      <Header />
      <div className="flex justify-center w-full">
        {session.user.planId !== 1 ? (
          <AlertSettings user={user} />
        ) : (
          <SubscribeForAlerts />
        )}
      </div>
    </div>
  );
}
