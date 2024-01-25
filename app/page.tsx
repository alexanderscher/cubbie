"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import ToggleButton from "@/app/components/buttons/ToggleButton";
import Button from "@/app/components/buttons/ToggleButton";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [buttons, setButtons] = useState({
    receipt: false,
    item: false,
  });

  const handleClick = (e: string) => {
    if (e === "receipt") {
      setButtons({ receipt: true, item: false });
    }
    if (e === "item") {
      setButtons({ receipt: false, item: true });
    }
  };

  const dataArray = [1, 2, 3, 4, 5];

  console.log(buttons);
  return (
    <main className="flex flex-col gap-10">
      <div className="flex justify-between items-center mt-10">
        <h1 className="text-3xl text-green-700">Inventory</h1>
        <div className="flex gap-2">
          <ToggleButton
            value={buttons.receipt}
            handleClick={() => handleClick("receipt")}
          >
            <p className="text-sm">Receipts</p>
          </ToggleButton>
          <ToggleButton
            value={buttons.item}
            handleClick={() => handleClick("item")}
          >
            <p className="text-sm">Items</p>
          </ToggleButton>
          <RegularButton styles={"bg-black border-black text-white"}>
            <p className="text-sm">Create New</p>
          </RegularButton>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {dataArray.map((item, index) => (
          <div
            key={index}
            className="border-t-[1.5px] border-black flex flex-col gap-2 "
          >
            <div className="flex justify-between">
              <h1 className="font-bold text-lg">Uniqlo</h1>
              <h1 className="text-sm">Created on 12/12/24</h1>
            </div>

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
              <h1 className="text-slate-400 font-bold">Items</h1>
              <p>Shirt</p>
              <p>Pants</p>
            </div>
            <div className="flex flex-col gap-2 mt-5">
              <RegularButton styles={"w-full border-green-900 "}>
                <p className="text-sm text-green-900">Edit</p>
              </RegularButton>
              <RegularButton styles={"w-full border-green-900 "}>
                <p className="text-sm text-green-900">View</p>
              </RegularButton>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
