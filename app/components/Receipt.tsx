"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import Link from "next/link";
import React, { useState } from "react";

const Receipt = () => {
  const [items, setItems] = useState(false);

  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-2 ">
      <div className="flex justify-between mb-2">
        <div>
          <h1 className="text-xl text-orange-500">
            <Link href="/receipt">Uniqlo</Link>
          </h1>
        </div>
        <h1 className="text-sm">Created on 12/12/24</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-slate-400">Order Number</h1>
        <h1>123213123</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-slate-400">Order Date</h1>
        <h1>1/1/25</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-slate-400">Return Date</h1>
        <h1>1/1/25</h1>
      </div>
      <div className="flex justify-between">
        <h1 className="text-slate-400">Amount</h1>
        <h1>$300.00</h1>
      </div>
      <div className="flex justify-between items-start">
        <button className="text-slate-400" onClick={() => setItems(!items)}>
          Items
        </button>
        <div className="flex flex-col">
          <button className="text-slate-400" onClick={() => setItems(!items)}>
            Items
          </button>
          {items && (
            <div>
              <p>Item 1</p>
              <p>Item 2</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-3">
        <RegularButton styles={"w-full border-green-900 "}>
          <p className="text-sm text-green-900">Edit</p>
        </RegularButton>

        <RegularButton styles={"w-full border-green-900 "}>
          <p className="text-sm text-green-900">Mark as returned</p>
        </RegularButton>
      </div>
    </div>
  );
};

export default Receipt;
