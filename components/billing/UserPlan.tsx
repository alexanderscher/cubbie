"use client";
import Image from "next/image";
import React from "react";
import styles from "@/components/profile/profile.module.css";
import { Menu } from "@/components/profile/Menu";
import { ProjectType } from "@/types/ProjectTypes";
import { Plan } from "@prisma/client";
import { UserType } from "@/types/UserSettingTypes";

const getTotalNumberOfItems = (user: UserType) => {
  return user.projects.reduce((total, project) => {
    const itemsInProject = project.receipts.reduce((sum, receipt) => {
      return sum + receipt.items.length; // Assuming receipt.items is an array
    }, 0);
    return total + itemsInProject;
  }, 0);
};

const UserPlan = ({ user }: { user: UserType }) => {
  const totalItems = getTotalNumberOfItems(user);
  console.log(user);

  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="flex flex-col gap-4 w-full max-w-[600px]">
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
        <div className="flex justify-between">
          <p className="text-emerald-900">Plan & Billing</p>
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

      {isOpen && <Menu setIsOpen={setIsOpen} />}
      {user.plan.id === 1 && (
        <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
          <h1>Current Plan</h1>
          <p>Free</p>
          <div>
            <p className="">$0.00 </p>
            <p className="text-xs">per month</p>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
        <h1>Usage</h1>

        <div>
          <p className="">{totalItems}</p>
        </div>
      </div>

      {/* {prices &&
          prices.map((price: any) => (
            <PricingCard price={price} key={price.id} session={session} />
          ))} */}
    </div>
  );
};

export default UserPlan;
