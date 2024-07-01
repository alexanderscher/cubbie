"use client";
import Image from "next/image";
import React, { use, useEffect, useState, useTransition } from "react";
import styles from "@/components/profile/profile.module.css";
import { Menu } from "@/components/profile/Menu";

import { UserType } from "@/types/UserSettingTypes";
import RegularButton from "@/components/buttons/RegularButton";
import Link from "next/link";
import { getApiUsage } from "@/actions/rateLimit/gpt";
import { BeatLoader } from "react-spinners";
import { addDaysToDate, formatDateToMMDDYY } from "@/utils/Date";

const UserPlan = ({ user }: { user: UserType }) => {
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
      <Usage user={user} />

      {isOpen && <Menu setIsOpen={setIsOpen} />}
    </div>
  );
};

export default UserPlan;

const PlanCard = ({ planId }: { planId: number | null | undefined }) => {
  return (
    <>
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4 ">
        <div className="flex flex-col gap-3">
          <h1 className=" text-lg text-emerald-900">Current Plan</h1>
          <p className=" text-slate-400">
            {planId === 1 || planId === null
              ? "Free"
              : planId === 2
              ? "All project plan"
              : "Limited project plan"}
          </p>
        </div>

        <div className=" text-slate-400">
          <p className="">
            {planId === 1 || planId === null
              ? "$0.00"
              : planId === 2
              ? "$2.00"
              : "$1.00"}
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

interface UsageType {
  used: number;
  limit: number;
  resetDate: Date;
}

const Usage = ({ user }: { user: UserType }) => {
  const [usage, setUsage] = useState({} as UsageType);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const apiUsage = () => {
      startTransition(async () => {
        if (user.planId && user.planId !== 1 && user.planId !== null) {
          const usage = await getApiUsage(user.id, user.planId);
          setUsage(usage);
        }
      });
    };
    if (user.planId && user.planId !== 1 && user.planId !== null) apiUsage();
  }, [user]);

  if (isPending) {
    return (
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4  justify-center items-center">
        <BeatLoader loading={isPending} size={15} color={"rgb(6 78 59)"} />
      </div>
    );
  }
  if (user.planId === 1 || user.planId === null) {
    if (user.projects.length > 0) {
      return (
        <div className="bg-white rounded-lg p-6  flex flex-col gap-4 ">
          <h1 className=" text-lg text-emerald-900">Plan Usage</h1>
          {user.projects.map((project) => (
            <div key={project.id} className="bg-orange-100 rounded-lg p-4">
              <p className="text-orange-600">
                <Link href={`/project/${project.id}`}>{project.name}</Link>
              </p>

              <div className="flex gap-2">
                <p>Receipt items:</p>
                <p>
                  {project.receipts.reduce(
                    (total, receipt) => total + receipt.items.length,
                    0
                  )}
                  /{usage.limit}
                </p>
              </div>
              <p className="text-slate-400">
                Resets on {formatDateToMMDDYY(usage.resetDate)}
              </p>
            </div>
          ))}
        </div>
      );
    }
  } else if (user.planId === 3) {
    return (
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4">
        <h1 className=" text-lg text-emerald-900">Plan Usage</h1>
        {user.planId === 3 && (
          <div>
            <p className="text-slate-400">AI usage:</p>
            <p className="text-slate-400"> {usage.used}/20</p>
          </div>
        )}
        <p className="text-slate-400">
          Resets on {formatDateToMMDDYY(usage.resetDate)}
        </p>

        {user.projects.map((project) => (
          <div
            key={project.id}
            className="bg-orange-100 rounded-lg p-4 text-sm"
          >
            <p className="text-orange-600">
              <Link href={`/project/${project.id}`}>{project.name}</Link>
            </p>

            <div className="flex gap-2">
              <p className="text-slate-400">Receipt items:</p>
              <p className="text-slate-400">
                {project.receipts.reduce(
                  (total, receipt) => total + receipt.items.length,
                  0
                )}
                /50
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  } else if (user.planId === 2) {
    return (
      <div className="bg-white rounded-lg p-6  flex flex-col gap-4 ">
        <h1 className=" text-lg text-emerald-900">Plan Usage</h1>
        {user.planId === 2 && (
          <p>
            {usage.used}/{usage.limit}
          </p>
        )}
      </div>
    );
  }
};
