"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import Image from "next/image";
import React from "react";

const Item = () => {
  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 ">
      <div className="flex justify-between">
        <div>
          <h1 className="font-bold text-lg text-orange-500">Macys</h1>
          <h1 className="font-bold text-lg">Levi 501 Jeans</h1>
          <h1 className="font-bold text-lg">12321312</h1>
        </div>

        <h1 className="text-sm">Created on 12/12/24</h1>
      </div>
      <div className="flex gap-6 items-start">
        <div className=" ">
          <Image
            src="/jeans.jpg"
            alt="jeans"
            width={160}
            height={160}
            style={{
              padding: "",
              objectFit: "contain",
              width: "100%",
              height: "100%",
              borderRadius: "2px",
            }}
          />
        </div>
        <div className="text-sm flex flex-col gap-1 ">
          <div>
            <h1 className="text-slate-400 font-bold">Receipt Number</h1>
            <h1>1234</h1>
          </div>

          <div>
            <h1 className="text-slate-400 font-bold">Order Date</h1>
            <h1>1/1/25</h1>
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Return Date</h1>
            <h1>1/1/25</h1>
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Quantity</h1>
            <h1>2</h1>
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Size</h1>
            <h1>S</h1>
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Amount</h1>
            <h1>$300.00</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <RegularButton styles={"w-full border-green-900 "}>
          <p className="text-sm text-green-900">Edit</p>
        </RegularButton>

        <RegularButton styles={"w-full border-green-900 "}>
          <p className="text-sm text-green-900">View Receipt</p>
        </RegularButton>
      </div>
    </div>
  );
};

export default Item;
