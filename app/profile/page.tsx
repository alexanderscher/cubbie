import { getUserInfo } from "@/lib/userDb";
import React from "react";

const getUser = async () => {
  const user = await getUserInfo();
  return user;
};

export default async function Profile() {
  const user = getUser();
  console.log(user);
  return <div>page</div>;
}
