import RegularButton from "@/app/components/buttons/RegularButton";
import Image from "next/image";
import React from "react";

const Item = () => {
  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-2 ">
      <div className="flex justify-between">
        <h1 className="font-bold text-lg">Levi 501 Jeans</h1>
        <h1 className="text-sm">Created on 12/12/24</h1>
      </div>
      <div className="flex justify-between">
        <Image src="/jeans.jpg" alt="jeans" width={100} height={100} />
        <div>
          <div>
            <h1 className="text-slate-400 font-bold">Store</h1>
            <h1>Macys</h1>
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Receipt Number</h1>
            <h1>1234</h1>
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Item Number</h1>
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
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-5">
        <RegularButton styles={"w-full border-green-700 "}>
          <p className="text-sm text-green-700">Edit</p>
        </RegularButton>

        <RegularButton styles={"w-full border-green-700 "}>
          <p className="text-sm text-green-700">View Receipt</p>
        </RegularButton>
      </div>
    </div>
  );
};

export default Item;
