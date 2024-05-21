"use client";
import Image from "next/image";
import React from "react";
import styles from "@/components/profile/profile.module.css";
import { Menu } from "@/components/profile/Menu";

interface UserPlanProps {
  user: any;
}

const UserPlan = ({ user }: UserPlanProps) => {
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
      {user.subscriptions.length === 0 && (
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
        <p>Free</p>
        <div>
          <p className="">$0.00 </p>
          <p className="text-xs">per month</p>
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
