"use client";
import { BarcodeScanner } from "@/app/components/BarcodeScanner";
import Header from "@/app/components/Header";
import Receipt from "@/app/components/Receipt";
import { useState } from "react";

export default function Home() {
  const dataArray = [1, 2, 3, 4, 5];
  const [showScanner, setShowScanner] = useState(false);

  const closeScanner = () => {
    setShowScanner(false);
  };

  return (
    <main className="flex flex-col pb-[400px]">
      <Header />

      <div className="grid grid-home grid-cols-4 gap-6 ">
        {dataArray.map((item, index) => (
          <div key={index}>
            <Receipt />
          </div>
        ))}
      </div>
    </main>
  );
}
