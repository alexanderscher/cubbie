import Header from "@/app/components/Header";
import Receipts from "@/app/components/Home/Receipts";
import { SearchProvider } from "@/app/components/context/SearchContext";
import React from "react";

const Memo = () => {
  return (
    <main className="flex flex-col pb-[400px]">
      <SearchProvider>
        <Header type="Memos" />
        <Receipts />
      </SearchProvider>
    </main>
  );
};

export default Memo;
