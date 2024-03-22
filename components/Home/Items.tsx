"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Item from "@/components/Item";
import { Item as ItemType } from "@/types/receiptTypes";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import Image from "next/image";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";

interface ItemsProps {
  items: ItemType[];
}

const Items = ({ items }: ItemsProps) => {
  const { filteredItemData, isItemLoading, initializeItems } =
    useSearchItemContext();

  useEffect(() => {
    if (items) {
      initializeItems(items as ItemType[]);
    }
  }, [items, initializeItems]);

  console.log(items);

  const searchParams = useSearchParams();
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);

  const [openItemId, setOpenItemId] = useState(null as number | null);

  const toggleOpenItem = (
    itemId: number | undefined,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    if (itemId === undefined) return;

    if (openItemId === itemId) {
      setOpenItemId(null);
    } else {
      setOpenItemId(itemId);
    }
  };

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
      <div className="flex flex-col gap-6 justify-center items-center mt-10">
        <Image
          src="/item_b.png"
          alt=""
          width={60}
          height={60}
          className="object-cover "
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <p className="text-xl">No items found</p>
        <button
          className="border-[1px] bg-emerald-900 text-white border-emerald-900 py-2 px-10 text-xs rounded-full w-50"
          onClick={() => setAddReceiptOpen(true)}
        >
          <p className="">Create Receipt</p>
        </button>
        {addReceiptOpen && (
          <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
        )}
      </div>
    );
  }

  if (searchParams.get("type") === "returned") {
    return (
      <div className="boxes pb-20">
        {sortedAndFilteredData.length > 0 &&
          sortedAndFilteredData.map(
            (item: ItemType) =>
              item.returned && (
                <Item
                  key={item.id}
                  item={item}
                  isOpen={openItemId === item.id}
                  onToggleOpen={(e) => toggleOpenItem(item.id, e)}
                />
              )
          )}
      </div>
    );
  } else if (searchParams.get("type") === "current") {
    return (
      <div className="boxes pb-20">
        {sortedAndFilteredData.length > 0 &&
          sortedAndFilteredData.map(
            (item: ItemType) =>
              !item.returned && (
                <Item
                  key={item.id}
                  item={item}
                  onToggleOpen={(e) => toggleOpenItem(item.id, e)}
                  isOpen={openItemId === item.id}
                />
              )
          )}
      </div>
    );
  }

  return (
    <div className="boxes pb-20">
      {sortedAndFilteredData.length > 0 &&
        sortedAndFilteredData.map((item: ItemType) => (
          <Item
            key={item.id}
            item={item}
            isOpen={openItemId === item.id}
            onToggleOpen={(e) => toggleOpenItem(item.id, e)}
          />
        ))}
    </div>
  );
};

export default Items;
