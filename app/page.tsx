"use client";
import Header from "@/app/components/Header";
import Receipt from "@/app/components/Receipt";
import { useState } from "react";

export default function Home() {
  const [buttons, setButtons] = useState({
    receipt: true,
    item: false,
  });

  const handleClick = (e: string) => {
    if (e === "receipt") {
      setButtons({ receipt: true, item: false });
    }
    if (e === "item") {
      setButtons({ receipt: false, item: true });
    }
  };

  const dataArray = [1, 2, 3, 4, 5];

  console.log(buttons);
  return (
    <main className="flex flex-col ">
      <Header />
      <div className="grid grid-cols-3 gap-6">
        {dataArray.map((item, index) => (
          <div key={index}>
            <Receipt />
          </div>
        ))}
      </div>
    </main>
  );
}
