"use client";
import Header from "@/app/components/Header";
import Item from "@/app/components/Item";
import { Item as ItemType } from "@/types/receipt";

import React, { useEffect, useState } from "react";

const Items = () => {
  const [items, setItems] = useState([]);
  const fetchItems = async () => {
    const res = await fetch(`/api/items/`);
    const data = await res.json();
    setItems(data.items);
  };
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="grid grid-home grid-cols-3 gap-6 ">
      {items.length > 0 &&
        items.map((item: ItemType) => <Item key={item.id} item={item} />)}
    </div>
  );
};

export default Items;
