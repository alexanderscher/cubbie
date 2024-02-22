"use client";
import Item from "@/app/components/Item";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import { Item as ItemType } from "@/types/receipt";
import React, { useEffect, useState } from "react";

const Items = () => {
  const { filteredItemData, setFilteredItemData } = useSearchItemContext();
  // const [items, setItems] = useState([]);
  // const fetchItems = async () => {
  //   const res = await fetch(`/api/items/`);
  //   const data = await res.json();
  //   setItems(data.items);
  // };
  // useEffect(() => {
  //   fetchItems();
  // }, []);

  return (
    <div className="boxes pb-20">
      {filteredItemData.length > 0 &&
        filteredItemData.map((item: ItemType) => (
          <Item
            key={item.id}
            item={item}
            // index={index}
            // length={filteredItemData.length}
          />
        ))}
    </div>
  );
};

export default Items;
