"use client";
import { useSearchContext } from "@/app/components/context/SearchContext";
import Receipt from "@/app/components/receiptComponents/Receipt";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { useSearchParams } from "next/navigation";

type SortField = "created_at" | "purchase_date" | "price";

const Receipts = () => {
  const { filteredData } = useSearchContext();
  const searchParams = useSearchParams();

  const sortField: SortField =
    (searchParams.get("sort") as SortField) || "return_date";

  const getTotalPrice = (items: Item[]) =>
    items.reduce((acc, item) => acc + item.price, 0);

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

  const sortedData = filteredData.sort(compareReceipts);

  if (searchParams.get("type") === "all")
    return (
      <div className="boxes">
        {sortedData.map((receipt: ReceiptType) => (
          <Receipt key={receipt.id} receipt={receipt} />
        ))}
      </div>
    );
  if (searchParams.get("type") === "receipt")
    return (
      <div className="boxes">
        {sortedData
          .filter((receipt: ReceiptType) => receipt.memo === false)
          .map((receipt: ReceiptType) => (
            <Receipt key={receipt.id} receipt={receipt} />
          ))}
      </div>
    );

  if (searchParams.get("type") === "memo") {
    return (
      <div className="boxes">
        {sortedData
          .filter((receipt: ReceiptType) => receipt.memo === true)
          .map((receipt: ReceiptType) => (
            <Receipt key={receipt.id} receipt={receipt} />
          ))}
      </div>
    );
  }
};

export default Receipts;
