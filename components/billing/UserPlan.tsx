"use client";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import styles from "@/components/profile/profile.module.css";
import { Menu } from "@/components/profile/Menu";
import { Line } from "rc-progress";

import { UserType } from "@/types/UserSettingTypes";
import RegularButton from "@/components/buttons/RegularButton";
import { cancelIndividual } from "@/actions/stripe/payment";
import { Subscription } from "@prisma/client";
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
  const totalItems = getTotalNumberOfItems(user);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const cancelSubscription = async (sub: Subscription) => {
    startTransition(async () => {
      try {
        const cancellation = await cancelIndividual(sub);
        console.log(cancellation.message);
      } catch (error) {
        console.error("Error canceling subscription:", error);
      }
    });
  };

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
            <h1>Current Plan</h1>
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
          <div className="bg-white rounded-lg p-6  flex flex-col gap-4 text-emerald-900">
            <h1>Usage</h1>

            <div className="">
              <div className="flex justify-between items-center">
                <p className="text-sm ">Total receipt items</p>
                <p className="text-xs"> {totalItems} / 50</p>
              </div>

              <Line percent={(totalItems / 50) * 100} strokeColor="#FB923C" />
            </div>
            {totalItems == 50 && (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-orange-400">
                  You&apos;ve reached plan limits. Please take advantage of the
                  plan upgrade{" "}
                </p>
                <RegularButton
                  styles="border-orange-400 bg-orange-400 text-white"
                  href={"/manage-plan"}
                >
                  <p className="text-xs">Upgrade plan</p>
                </RegularButton>
              </div>
            )}
          </div>
        </>
      )}
      {user.plan.id === 3 && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <p className="text-emerald-900">Current Plans</p>
              <RegularButton
                styles="border-orange-400 bg-orange-400 text-white"
                href={"/manage-plan"}
              >
                <p className="text-xs">Change plans</p>
              </RegularButton>
            </div>
          </div>
          {user.subscriptions?.map((sub) => (
            <>
              <div className="bg-white rounded-lg p-6  flex flex-col gap-4 text-emerald-900">
                <h1>{sub.project.name}</h1>

                <div>
                  <p className="">$0.00 </p>
                  <p className="text-xs">per month</p>
                </div>

                <div className="">
                  <h1>Usage</h1>

                  <div className="">
                    <div className="flex justify-between items-center">
                      <p className="text-sm ">Total receipt items</p>
                      <p className="text-xs"> {totalItems} / 50</p>
                    </div>

                    <Line
                      percent={(totalItems / 50) * 100}
                      strokeColor="#FB923C"
                    />
                  </div>
                  {totalItems == 50 && (
                    <div className="flex flex-col gap-3">
                      <p className="text-sm text-orange-400">
                        You&apos;ve reached plan limits. Please take advantage
                        of the plan upgrade{" "}
                      </p>
                      <RegularButton
                        styles="border-orange-400 bg-orange-400 text-white"
                        href={"/manage-plan"}
                      >
                        <p className="text-xs">Upgrade plan</p>
                      </RegularButton>
                    </div>
                  )}
                </div>
                <RegularButton
                  styles="border-orange-400 bg-orange-400 text-white"
                  handleClick={() => cancelSubscription(sub)}
                >
                  <p className="text-xs">Cancel plan</p>
                </RegularButton>
              </div>
            </>
          ))}
        </div>
      )}
      {isPending && <Loading loading={isPending} />}

      {isOpen && <Menu setIsOpen={setIsOpen} />}
    </div>
  );
};

export default UserPlan;
