"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Item from "@/components/Item";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import PageLoading from "@/components/Loading/PageLoading";
import { NoItems } from "@/components/item/NoItems";
import { getItemsClient } from "@/lib/getItemsClient";
import { ItemType } from "@/types/ItemsTypes";

const Items = () => {
  const { filteredItemData, isItemLoading, initializeItems, fetchItems } =
    useSearchItemContext();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

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
    return <PageLoading loading={isItemLoading} />;
  }
  if (sortedAndFilteredData.length === 0 && !isItemLoading) {
    return (
      <div className="boxes">
        <div className="box relative">
          <NoItems
            setAddReceiptOpen={setAddReceiptOpen}
            addReceiptOpen={addReceiptOpen}
          />
        </div>
      </div>
    );
  }
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let filteredData = sortedAndFilteredData.filter((item) => {
    if (type === "expired") {
      return item.receipt.expired;
    } else if (type === "active") {
      return !item.receipt.expired;
    }
    return true;
  });

  if (status === "returned" || status === "current") {
    filteredData = filteredData.filter((item) =>
      status === "returned" ? item.returned : !item.returned
    );

    if (filteredData.length === 0) {
      return (
        <NoItems
          setAddReceiptOpen={setAddReceiptOpen}
          addReceiptOpen={addReceiptOpen}
        />
      );
    }

    return (
      <div className="boxes pb-20">
        {filteredData.map((item) => (
          <Item
            setOpenItemId={setOpenItemId}
            key={item.id}
            item={item}
            isOpen={openItemId === item.id}
            onToggleOpen={(e) => toggleOpenItem(item.id, e)}
          />
        ))}
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <NoItems
        setAddReceiptOpen={setAddReceiptOpen}
        addReceiptOpen={addReceiptOpen}
      />
    );
  }

  return (
    <div className="boxes pb-20">
      {filteredData.map((item) => (
        <Item
          setOpenItemId={setOpenItemId}
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
