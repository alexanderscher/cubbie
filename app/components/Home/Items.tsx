"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Item from "@/app/components/Item";
import { Item as ItemType } from "@/types/receipt";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";

const Items = () => {
  const { filteredItemData, isItemLoading } = useSearchItemContext();
  const searchParams = useSearchParams();

  const sortFieldParam = searchParams.get("sort");
  const sortField = sortFieldParam?.startsWith("-")
    ? sortFieldParam.slice(1)
    : sortFieldParam;
  const sortOrder = sortFieldParam?.startsWith("-") ? "desc" : "asc";

  const sortedAndFilteredData = useMemo(() => {
    if (!sortField) return filteredItemData;

    return filteredItemData.sort((a: ItemType, b: ItemType) => {
      let valueA: any, valueB: any;

      if (sortField === "created_at") {
        valueA = a.receipt?.created_at;
        valueB = b.receipt?.created_at;
      } else if (sortField === "purchase_date") {
        valueA = a.receipt?.purchase_date;
        valueB = b.receipt?.purchase_date;
      } else if (sortField === "return_date") {
        valueA = a.receipt?.purchase_date;
        valueB = b.receipt?.purchase_date;
      } else if (sortField === "price") {
        valueA = b.price;
        valueB = a.price;
      } else {
        console.warn(`Sort field ${sortField} is not handled.`);
        return 0;
      }

      if (valueA === undefined || valueB === undefined) return 0;

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortOrder === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return 0;
    });
  }, [filteredItemData, sortField, sortOrder]);

  if (isItemLoading) {
    return <div>Loading...</div>;
  }
  if (sortedAndFilteredData.length === 0 && !isItemLoading) {
    return (
      <div className="">
        <p>No data found</p>
      </div>
    );
  }

  if (searchParams.get("type") === "returned") {
    return (
      <div className="boxes pb-20">
        {sortedAndFilteredData.length > 0 &&
          sortedAndFilteredData.map(
            (item: ItemType) =>
              item.returned && <Item key={item.id} item={item} />
          )}
      </div>
    );
  } else if (searchParams.get("type") === "current") {
    return (
      <div className="boxes pb-20">
        {sortedAndFilteredData.length > 0 &&
          sortedAndFilteredData.map(
            (item: ItemType) =>
              !item.returned && <Item key={item.id} item={item} />
          )}
      </div>
    );
  }

  return (
    <div className="boxes pb-20">
      {sortedAndFilteredData.length > 0 &&
        sortedAndFilteredData.map((item: ItemType) => (
          <Item key={item.id} item={item} />
        ))}
    </div>
  );
};

export default Items;
