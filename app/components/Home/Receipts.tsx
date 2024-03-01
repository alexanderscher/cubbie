"use client";
import { useSearchContext } from "@/app/components/context/SearchContext";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

const Receipts = () => {
  const { filteredData, isLoading } = useSearchContext();
  const searchParams = useSearchParams();

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
    return <NoData />;
  }

  if (searchParams.get("receiptType") === "receipt")
    return (
      <div className="boxes">
        {searchParams.get("expired") === "false" || !searchParams.get("expired")
          ? sortedAndFilteredData
              .filter(
                (receipt: ReceiptType) =>
                  receipt.memo === false && receipt.expired === false
              )
              .map((receipt: ReceiptType) => (
                <Receipt key={receipt.id} receipt={receipt} />
              ))
          : sortedAndFilteredData
              .filter(
                (receipt: ReceiptType) =>
                  receipt.memo === false && receipt.expired === true
              )
              .map((receipt: ReceiptType) => (
                <Receipt key={receipt.id} receipt={receipt} />
              ))}
      </div>
    );
  else if (searchParams.get("receiptType") === "memo") {
    return (
      <div className="boxes">
        {searchParams.get("expired") === "false" || !searchParams.get("expired")
          ? sortedAndFilteredData
              .filter(
                (receipt: ReceiptType) =>
                  receipt.memo === true && receipt.expired === false
              )
              .map((receipt: ReceiptType) => (
                <Receipt key={receipt.id} receipt={receipt} />
              ))
          : sortedAndFilteredData
              .filter(
                (receipt: ReceiptType) =>
                  receipt.memo === true && receipt.expired === true
              )
              .map((receipt: ReceiptType) => (
                <Receipt key={receipt.id} receipt={receipt} />
              ))}
      </div>
    );
  }

  return (
    <div className="boxes">
      {searchParams.get("expired") === "false" || !searchParams.get("expired")
        ? filteredData
            .filter((receipt: ReceiptType) => receipt.expired === false)
            .map((receipt: ReceiptType) => (
              <Receipt key={receipt.id} receipt={receipt} />
            ))
        : filteredData
            .filter((receipt: ReceiptType) => receipt.expired === true)
            .map((receipt: ReceiptType) => (
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
