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
    <div className="flex flex-col gap-4 w-full max-w-[800px]">
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-lg text-emerald-900">Plan & Billing</p>
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

      <PlanCard planId={user.planId} />

      {isPending && <Loading loading={isPending} />}

      {isOpen && <Menu setIsOpen={setIsOpen} />}
    </div>
  );
};

export default UserPlan;

const PlanCard = ({ planId }: { planId: number | null | undefined }) => {
  // const [planName, setPlanName] = useState("");
  // const [planPrice, setPlanPrice] = useState("");

  // useEffect(() => {
  //   if (planId === 1) {
  //     setPlanName("Free");
  //     setPlanPrice("$0.00");
  //   } else if (planId === 2) {
  //     setPlanName("All project plan");
  //     setPlanPrice("$2.00");
  //   } else if (planId === 3) {
  //     setPlanName("Limited project plan");
  //     setPlanPrice("$1.00");
  //   }
  // }, [planId]);
  return (
    <>
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4 ">
        <div className="flex flex-col gap-3">
          <h1 className=" text-lg">Current Plan</h1>
          <p className="text-lg text-orange-600">
            {planId === 1
              ? "Free"
              : planId === 2
              ? "All project plan"
              : "Limited project plan"}
          </p>
        </div>

        <div className="text-lg">
          <p className="">
            {planId === 1 ? "$0.00" : planId === 2 ? "$2.00" : "$1.00"}
          </p>
          <p className="">per month</p>
        </div>
        <RegularButton
          styles="border-orange-600 bg-orange-600 text-white"
          href={"/manage-plan"}
        >
          <p className="text-sm">Manage plan</p>
        </RegularButton>
      </div>
    </>
  );
};
