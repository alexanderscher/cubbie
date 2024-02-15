import Header from "@/app/components/Header";
import Receipts from "@/app/components/Home/Receipts";
import Receipt from "@/app/components/Receipt";
import { useState } from "react";

export default function Home() {
  return (
    <main className="flex flex-col pb-[400px]">
      <Header />

      <Receipts />
    </main>
  );
}
