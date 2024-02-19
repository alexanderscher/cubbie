"use client";
import { useParams } from "next/navigation";
import { Item as ItemType } from "@/types/receipt";
import React, { useEffect, useState } from "react";

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
    console.log(item);
  }, [id]);

  return (
    <div>
      <div></div>
      <div></div>
    </div>
  );
};

export default ItemID;
