"use client";
import Header from "@/app/components/Header";
import Item from "@/app/components/Item";
import React from "react";

const page = () => {
  const dataArray = [1, 2, 3, 4, 5];

  return (
    <div>
      <Header />
      <div className="grid grid-cols-3 gap-8">
        {dataArray.map((item, index) => (
          <div key={index}>
            <Item />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
