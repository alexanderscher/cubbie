"use client";
import { useSearchContext } from "@/app/components/context/SearchContext";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const Receipts = () => {
  const { filteredData, isLoading } = useSearchContext();
  const searchParams = useSearchParams();

  const [openReceiptId, setOpenReceiptId] = useState(null as number | null);

  const toggleOpenReceipt = (receiptId: number | undefined) => {
    if (receiptId === undefined) return;

    if (openReceiptId === receiptId) {
      setOpenReceiptId(null);
    } else {
      setOpenReceiptId(receiptId);
    }
  };

  const sortFieldParam = searchParams.get("sort");
  const sortField = sortFieldParam?.startsWith("-")
    ? sortFieldParam.slice(1)
    : sortFieldParam;
  const sortOrder = sortFieldParam?.startsWith("-") ? "desc" : "asc";
  const getTotalPrice = (items: Item[]) =>
    items.reduce((acc, item) => acc + item.price, 0);

  const storeType = searchParams.get("storeType") || "all";

  const sortedAndFilteredData = useMemo(() => {
    const filteredByStoreType =
      storeType === "all"
        ? filteredData
        : filteredData.filter(
            (receipt) => receipt.type.toLocaleLowerCase() === storeType
          );
    const compareReceipts = (a: ReceiptType, b: ReceiptType) => {
      if (sortField === "price") {
        const totalPriceA = getTotalPrice(a.items);
        const totalPriceB = getTotalPrice(b.items);
        if (sortOrder === "asc") {
          return totalPriceB - totalPriceA;
        } else {
          return totalPriceA - totalPriceB;
        }
      } else {
        const dateA = new Date(
          a[sortField as keyof ReceiptType] as Date
        ).getTime();
        const dateB = new Date(
          b[sortField as keyof ReceiptType] as Date
        ).getTime();
        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      }
    };
    return filteredByStoreType.sort(compareReceipts);
  }, [filteredData, storeType, sortField, sortOrder]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (sortedAndFilteredData.length === 0 && !isLoading) {
    return (
      <div className="">
        <p>No receipts found</p>
      </div>
    );
  }

  return (
    <div className="boxes">
      {searchParams.get("expired") === "false" || !searchParams.get("expired")
        ? sortedAndFilteredData
            .filter((receipt: ReceiptType) => receipt.expired === false)
            .map((receipt: ReceiptType) => (
              <Receipt
                key={receipt.id}
                receipt={receipt}
                onToggleOpen={() => toggleOpenReceipt(receipt.id)}
                isOpen={openReceiptId === receipt.id}
              />
            ))
        : sortedAndFilteredData
            .filter((receipt: ReceiptType) => receipt.expired === true)
            .map((receipt: ReceiptType) => (
              <Receipt
                key={receipt.id}
                receipt={receipt}
                onToggleOpen={() => toggleOpenReceipt(receipt.id)}
                isOpen={openReceiptId === receipt.id}
              />
            ))}
    </div>
  );
};

export default Receipts;
