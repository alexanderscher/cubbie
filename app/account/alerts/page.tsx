import Header from "@/components/profile/Header";
import { UserAlerts } from "@/types/AppTypes";
import React from "react";
import styles from "@/components/profile/profile.module.css";
import AlertSettings from "@/components/profile/AlertSetting";
import { getUserInfo } from "@/lib/userDb";
import { Session } from "@/types/Session";
import { auth } from "@/auth";
import RegularButton from "@/components/buttons/RegularButton";

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
          <SubscribeToAlerts />
        )}
      </div>
    </div>
  );
}

const SubscribeToAlerts = () => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[800px]">
      <div className="bg-white rounded-lg  flex flex-col p-6">
        <h1>Subscribe to get alerts</h1>
        <RegularButton
          href="/manage-plan"
          styles="bg-orange-600 border-orange-600"
        >
          <p className="text-sm text-white"> View plans</p>
        </RegularButton>
      </div>
    </div>
  );
};
