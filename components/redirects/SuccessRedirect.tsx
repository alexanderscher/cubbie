"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { Subscription } from "@prisma/client";
import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Session } from "next-auth";
import React, { use, useEffect, useState } from "react";

interface SuccessRedirectProps {
  subscription?: Subscription;
}

const SuccessRedirect = ({ subscription }: SuccessRedirectProps) => {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-20 rounded-xl shadow max-w-lg mx-auto">
        {subscription && (
          <div className="">
            <div className="flex items-center justify-center space-x-2  flex-col gap-3 ">
              <div className="bg  rounded-full p-1">
                <CheckIcon className="text-emerald-900 w-[50px] h-[50px]" />
              </div>

              <div className="space-y-3  text-center">
                <h1 className="text-xl  text-emerald-900  ">
                  Subscription Successful
                </h1>

                <p className="text-emerald-900  ">
                  {subscription.planId === 2
                    ? "All Project Plan"
                    : "Limited Project Plan"}
                </p>
              </div>
            </div>
            <RegularButton
              styles={
                "w-full text-white bg-emerald-900 border-emerald-900 mt-6"
              }
              href="/"
            >
              <p className="text-sm">Home</p>
            </RegularButton>
          </div>
        )}

        {!subscription && (
          <div className=" max-w-md m-auto flex-col flex  gap-4  items-center ">
            <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
              <ExclamationTriangleIcon className=" text-red-500 w-3/4 h-1/2" />
            </div>
            <h2 className="text-xl font-semibold text-red-500">Error</h2>
            <div className="mt-3 text-sm text-red-500 text-center">
              <p>
                We encountered an issue fetching your subscription details.
                Please contact support.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessRedirect;
