import Account from "@/components/profile/Account";
import { getUserInfo } from "@/lib/userDb";
import { User } from "@prisma/client";
import React from "react";

const getUser = async () => {
  const user = await getUserInfo();
  return user as User;
};

export default async function Profile() {
  const user = await getUser();

  return (
    <div>
      <Account user={user} />
    </div>
  );
}
