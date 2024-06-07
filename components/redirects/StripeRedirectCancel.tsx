"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { CheckIcon } from "@radix-ui/react-icons";
import { getSession } from "next-auth/react";
import { useEffect } from "react";

const StripeRedirectSuccess = () => {
  useEffect(() => {
    getSession().then((session) => {
      console.log("Session refreshed", session);
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="bg-white p-20 rounded-xl shadow max-w-lg mx-auto">
        <div className="">
          <div className="flex items-center justify-center space-x-2  flex-col gap-3 ">
            <div className="bg  rounded-full p-1">
              <CheckIcon className="text-emerald-900 w-[50px] h-[50px]" />
            </div>

            <div className="space-y-3  text-center">
              <h1 className="text-xl  text-emerald-900  ">
                Subscription canceled
              </h1>
            </div>
          </div>
          <RegularButton
            styles={"w-full text-white bg-emerald-900 border-emerald-900 mt-6"}
            href="/"
          >
            <p className="text-sm">Home</p>
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default StripeRedirectSuccess;
