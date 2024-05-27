"use client";
import Image from "next/image";
import React, { use, useEffect, useState, useTransition } from "react";
import styles from "@/components/profile/profile.module.css";
import { Menu } from "@/components/profile/Menu";
import { Line } from "rc-progress";

import { UserType } from "@/types/UserSettingTypes";
import RegularButton from "@/components/buttons/RegularButton";
import Loading from "@/components/Loading/Loading";

const getTotalNumberOfItems = (user: UserType) => {
  return user.projects.reduce((total, project) => {
    const itemsInProject = project.receipts.reduce((sum, receipt) => {
      return sum + receipt.items.length; // Assuming receipt.items is an array
    }, 0);
    return total + itemsInProject;
  }, 0);
};

const UserPlan = ({ user }: { user: UserType }) => {
  console.log(user);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (user.projects.length > 0) {
      setTotalItems(getTotalNumberOfItems(user));
    }
  }, [user]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px]">
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-emerald-900">Plans & Billing</p>
          <div className={styles.button}>
            <Image
              src={"/dashboard_b.png"}
              alt="user image"
              width={20}
              height={20}
              className="cursor-pointer"
              onClick={() => {
                console.log(isOpen);
                setIsOpen(!isOpen);
              }}
            />
          </div>
        </div>
      </div>

      {user.plan.id === 1 && (
        <>
          <div className="bg-white rounded-lg p-6  flex flex-col gap-4 text-emerald-900">
            <h1 className="text-slate-400">Current Plan</h1>
            <p>Free</p>
            <div>
              <p className="">$0.00 </p>
              <p className="text-xs">per month</p>
            </div>
            <RegularButton
              styles="border-orange-400 bg-orange-400 text-white"
              href={"/manage-plan"}
            >
              <p className="text-xs">Manage plan</p>
            </RegularButton>
          </div>
        </>
      )}
      {user.plan.id === 2 && (
        <>
          <div className="bg-white rounded-lg p-6  flex flex-col gap-4 text-emerald-900">
            <h1 className="text-slate-400">Current Plan</h1>
            <p>All project plan</p>
            <div>
              <p className="">$0.00 </p>
              <p className="text-xs">per month</p>
            </div>
            <RegularButton
              styles="border-orange-400 bg-orange-400 text-white"
              href={"/manage-plan"}
            >
              <p className="text-xs">Manage plan</p>
            </RegularButton>
          </div>
        </>
      )}

      {isPending && <Loading loading={isPending} />}

      {isOpen && <Menu setIsOpen={setIsOpen} />}
    </div>
  );
};

export default UserPlan;
