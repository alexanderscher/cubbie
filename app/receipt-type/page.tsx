"use client";
import LargeButton from "@/app/components/buttons/LargeButton";
import { useRouter } from "next/navigation";
import React from "react";

const ReceiptType = () => {
  const router = useRouter();
  return (
    <div
      className="flex flex-col h-full justify-center items-center"
      style={{ height: "calc(100vh - 250px)" }}
    >
      <div className="w-full sm:w-[600px] gap-8 flex flex-col justify-center items-center">
        <div className="flex justify-start w-full">
          <h1 className="text-2xl items-start text-emerald-900">
            Choose Receipt Type
          </h1>
        </div>

        <div className="receipt-types">
          <LargeButton
            height="h-[150px]"
            handleClick={() => router.push("/receipt-type/online")}
          >
            <p>Online</p>
          </LargeButton>
          <LargeButton
            height="h-[150px]"
            handleClick={() => router.push("/receipt-type/store")}
          >
            <p>In Store</p>
          </LargeButton>
          <LargeButton
            height="h-[150px]"
            handleClick={() => router.push("/receipt-type/memo")}
          >
            <p>Memo</p>
          </LargeButton>
        </div>
      </div>
    </div>
  );
};

export default ReceiptType;
