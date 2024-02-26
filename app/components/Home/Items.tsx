"use client";
import Item from "@/app/components/Item";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import { Item as ItemType } from "@/types/receipt";
import React, { useEffect, useState } from "react";

const Items = () => {
  const { filteredItemData, setFilteredItemData } = useSearchItemContext();

  return (
    <div className="boxes pb-20">
      {filteredItemData.length > 0 &&
        filteredItemData.map((item: ItemType) => (
          <Item key={item.id} item={item} />
        ))}
    </div>
  );
};

export default Items;
