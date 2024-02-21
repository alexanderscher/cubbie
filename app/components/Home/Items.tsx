"use client";
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
    <div className="boxes pb-20">
      {items.length > 0 &&
        items.map((item: ItemType, index: number) => (
          <Item key={item.id} item={item} index={index} length={items.length} />
        ))}
    </div>
  );
};

export default Items;
