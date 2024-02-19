import RegularButton from "@/app/components/buttons/RegularButton";
import Image from "next/image";
import React from "react";

const ReceiptItems = () => {
  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 ">
      <div className="flex justify-between">
        <h1 className="text-orange-600">Levi 501 Jeans</h1>
      </div>
      <div className="flex gap-6 ">
        {/* <img
          src={item.photo[0].url}
          style={{
            padding: "",
            objectFit: "contain",
            width: "50%",
            height: "50%",
            borderRadius: "2px",
          }}
        /> */}

        <div className="text-sm flex flex-col gap-3 ">
          <div>
            <h1 className="text-slate-500 ">Amount</h1>
            <h1>200</h1>
          </div>
          <div>
            <h1 className="text-slate-500 ">Barcode</h1>
            <h1>123123</h1>
          </div>
          {/* <RegularButton styles={"w-full border-emerald-900 "}>
            <p className="text-sm text-emerald-900 ">Return</p>
          </RegularButton> */}
        </div>
      </div>
    </div>
  );
};

export default ReceiptItems;
