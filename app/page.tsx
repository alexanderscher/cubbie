"use client";
import Item from "@/app/components/Item";
import Receipt from "@/app/components/Receipt";
import RegularButton from "@/app/components/buttons/RegularButton";
import ToggleButton from "@/app/components/buttons/ToggleButton";
import Button from "@/app/components/buttons/ToggleButton";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [buttons, setButtons] = useState({
    receipt: true,
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
        <h1 className="text-3xl text-green-600">Inventory</h1>
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
      <div className="flex gap-2">
        <input
          className="border-[1.5px] w-full bg border-black rounded-md p-1 placeholder:text-black focus:outline-none"
          placeholder="Search"
        ></input>
        <select className="border-[1.5px] w-[100px] bg border-black rounded-md p-1 placeholder:text-black focus:outline-none"></select>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {buttons.receipt ? (
          <>
            {dataArray.map((item, index) => (
              <div key={index}>
                <Receipt />
              </div>
            ))}
          </>
        ) : (
          <>
            {dataArray.map((item, index) => (
              <div key={index}>
                <Item />
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
