import Image from "next/image";
import React from "react";

const ReceiptItems = () => {
  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 ">
      <div className="flex justify-between">
        <h1 className="text-lg text-orange-500">Levi 501 Jeans</h1>
        <h1 className="text-lg">#12321312</h1>
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
        <div className="text-sm flex flex-col gap-1 ">
          <div>
            <h1 className="text-slate-400 font-bold">Quantity</h1>
            <h1>1</h1>
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
    </div>
  );
};

export default ReceiptItems;
