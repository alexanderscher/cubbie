import { User } from "@prisma/client";
import React from "react";

interface Props {
  user: User;
}

const Account = ({ user }: Props) => {
  return (
    <div className="flex flex-col gap-10 ">
      <div className="border-b-[1px] border-emerald-900 w-full ">
        <h1 className="text-2xl text-emerald-900 pb-4">User Profile</h1>
        <div className="flex gap-4 text-emerald-900">
          <p>Profile</p>
          <p>Profile</p>
          <p>Profile</p>
        </div>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className=" gap-4 w-full max-w-[800px] ">
          <div className="bg-white rounded-md shadow p-4 flex flex-col gap-4 w-full">
            <p>Personal Information</p>
            <div className="flex flex-col space-y-2">
              <div>
                <p className="text-xs ">Name</p>
                <input className="w-full border-[1px] border-slate-400 focus:border-emerald-900 focus:outline-none rounded-md p-2" />
              </div>
              <div>
                <p className="text-xs ">Email</p>
                <p>{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
