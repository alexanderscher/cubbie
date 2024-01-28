import RegularButton from "@/app/components/buttons/RegularButton";
import Image from "next/image";
import React from "react";

const ReceiptItems = () => {
  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 ">
      <div className="flex justify-between">
        <h1 className="text-lg text-orange-500">Levi 501 Jeans</h1>
      </div>
      <div className="flex gap-6 ">
        <div className=" ">
          <Image
            src="/jeans.jpg"
            alt="jeans"
            width={150}
            height={150}
            style={{
              padding: "",
              objectFit: "contain",
              width: "100%",
              height: "100%",
              borderRadius: "2px",
            }}
          />
        </div>
        <div className="text-sm flex flex-col gap-3 ">
          <div>
            <h1 className="text-slate-400 font-bold">Amount</h1>
            <h1>$300.00</h1>
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Barcode</h1>
            <h1>123123131</h1>
          </div>
          <RegularButton styles={"w-full border-green-900 "}>
            <p className="text-xs text-green-900">Return</p>
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default ReceiptItems;
