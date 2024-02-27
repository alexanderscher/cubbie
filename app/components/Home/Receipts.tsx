"use client";
import { useSearchContext } from "@/app/components/context/SearchContext";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type SortField = "created_at" | "purchase_date" | "price";

const Receipts = () => {
  const { filteredData, isLoading } = useSearchContext();
  const searchParams = useSearchParams();

  const sortField: SortField =
    (searchParams.get("sort") as SortField) || "return_date";

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
        return totalPriceB - totalPriceA;
      } else {
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();
        return dateB - dateA;
      }
    };

    return filteredByStoreType.sort(compareReceipts);
  }, [filteredData, storeType, sortField]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (sortedAndFilteredData.length === 0 && !isLoading) {
    return <NoData />;
  }

  if (searchParams.get("receiptType") === "receipt")
    return (
      <div className="boxes">
        {sortedAndFilteredData
          .filter((receipt: ReceiptType) => receipt.memo === false)
          .map((receipt: ReceiptType) => (
            <Receipt key={receipt.id} receipt={receipt} />
          ))}
      </div>
    );
  else if (searchParams.get("receiptType") === "memo") {
    return (
      <div className="boxes">
        {sortedAndFilteredData
          .filter((receipt: ReceiptType) => receipt.memo === true)
          .map((receipt: ReceiptType) => (
            <Receipt key={receipt.id} receipt={receipt} />
          ))}
      </div>
    );
  }

  return (
    <div className="boxes">
      {sortedAndFilteredData.map((receipt: ReceiptType) => (
        <Receipt key={receipt.id} receipt={receipt} />
      ))}
    </div>
  );
};

export default Receipts;

const NoData = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <h1 className="text-2xl">No Data</h1>
    </div>
  );
};
