import ReceiptItems from "@/app/components/ReceiptItems";
import React from "react";

const page = () => {
  const dataArray = [1, 2, 3, 4, 5];

  return (
    <div className="receipts ">
      <div className="flex flex-col gap-4 receipt-bar">
        <h1 className="text-green-900 text-2xl ">Macys</h1>
        <div>
          <div className="receipt-info">
            <h1 className="text-slate-400">Store</h1>
            <h1 className="">Macys</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400">Address</h1>
            <h1 className="">1234 12th street 90077</h1>
          </div>
        </div>
        <div>
          <div className="receipt-info">
            <h1 className="text-slate-400">Number of items</h1>
            <h1 className="">5</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400">TOTAL AMOUNT</h1>
            <h1 className="">$300.00</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400">CARD</h1>
            <h1 className="">SB 1332</h1>
          </div>
        </div>
        <div>
          <div className="receipt-info">
            <h1 className="text-slate-400">Date Ordered</h1>
            <h1 className="">12/23/23</h1>
          </div>
          <div className="receipt-info">
            <h1 className="text-slate-400">Return Date</h1>
            <h1 className="">12/30/23</h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-10 receipt-grid">
        {dataArray.map((item, index) => (
          <div key={index}>
            <ReceiptItems />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
