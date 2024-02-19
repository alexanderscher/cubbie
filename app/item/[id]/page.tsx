"use client";
import { useParams } from "next/navigation";
import { Item as ItemType } from "@/types/receipt";
import React, { useEffect, useState } from "react";
import RegularButton from "@/app/components/buttons/RegularButton";

const ItemID = () => {
  const { id } = useParams();

  const [item, setItem] = useState({} as ItemType);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      setItem(data.item);
    };
    fetchItem();
  }, [id]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between w-full">
        <h1 className="text-3xl text-orange-600">{item.receipt.store}</h1>
        <RegularButton styles="bg-emerald-900">
          <p className="text-white text-sm">Edit</p>
        </RegularButton>
      </div>
      <div></div>
    </div>
  );
};

export default ItemID;
