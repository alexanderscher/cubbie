import Header from "@/app/components/Header";
import Receipts from "@/app/components/Home/Receipts";
import React from "react";

const Memo = () => {
  return (
    <main className="flex flex-col pb-[400px]">
      <Header type="Memos" />
      <Receipts />
    </main>
  );
};

export default Memo;
