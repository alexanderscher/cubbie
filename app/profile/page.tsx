import { auth } from "@/auth";
import Account from "@/components/profile/Account";
import { Session } from "@/types/AppTypes";
import React from "react";

export default async function Profile() {
  const session = (await auth()) as Session;

  return (
    <div>
      <Account session={session} />
    </div>
  );
}
