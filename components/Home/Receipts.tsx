"use client";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import PageLoading from "@/components/Loading/PageLoading";
import { NoReceipts } from "@/components/receiptComponents/NoReceipts";
import Receipt from "@/components/receiptComponents/Receipt";
import { Item, Receipt as ReceiptType } from "@/types/AppTypes";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ReceiptsProps {
  serverData: ReceiptType[];
}

const Receipts = ({ serverData }: ReceiptsProps) => {
  const { filteredReceiptData, isReceiptLoading, initializeReceipts } =
    useSearchReceiptContext();
  const searchParams = useSearchParams();
  const [openReceiptId, setOpenReceiptId] = useState(null as number | null);
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);

  useEffect(() => {
    if (serverData) {
      initializeReceipts(serverData as ReceiptType[]);
    }
  }, [serverData, initializeReceipts]);

  const toggleOpenReceipt = (
    receiptId: number | undefined,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
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
        ? filteredReceiptData
        : filteredReceiptData.filter(
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
  }, [filteredReceiptData, storeType, sortField, sortOrder]);

  if (isReceiptLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PageLoading loading={isReceiptLoading} />
      </div>
    );
  }

  if (searchParams.get("expired") === "false") {
    const activeReceipts = sortedAndFilteredData.filter(
      (receipt: ReceiptType) => !receipt.expired
    );
    if (activeReceipts.length === 0) {
      return (
        <NoReceipts
          setAddReceiptOpen={setAddReceiptOpen}
          addReceiptOpen={addReceiptOpen}
        />
      );
    } else {
      return (
        <div className="boxes">
          {activeReceipts.map((receipt: ReceiptType) => (
            <Receipt
              key={receipt.id}
              receipt={receipt}
              onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
              isOpen={openReceiptId === receipt.id}
              setOpenReceiptId={setOpenReceiptId}
            />
          ))}
        </div>
      );
    }
  } else if (searchParams.get("expired") === "true") {
    const expiredReceipts = sortedAndFilteredData.filter(
      (receipt: ReceiptType) => receipt.expired
    );
    if (expiredReceipts.length === 0) {
      return (
        <NoReceipts
          setAddReceiptOpen={setAddReceiptOpen}
          addReceiptOpen={addReceiptOpen}
        />
      );
    } else {
      return (
        <div className="boxes">
          {expiredReceipts.map((receipt: ReceiptType) => (
            <Receipt
              key={receipt.id}
              receipt={receipt}
              onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
              isOpen={openReceiptId === receipt.id}
              setOpenReceiptId={setOpenReceiptId}
            />
          ))}
        </div>
      );
    }
  } else {
    if (sortedAndFilteredData.length === 0 && !isReceiptLoading) {
      return (
        <NoReceipts
          setAddReceiptOpen={setAddReceiptOpen}
          addReceiptOpen={addReceiptOpen}
        />
      );
    } else {
      return (
        <div className="boxes">
          {sortedAndFilteredData.map((receipt: ReceiptType) => (
            <Receipt
              key={receipt.id}
              receipt={receipt}
              onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
              isOpen={openReceiptId === receipt.id}
              setOpenReceiptId={setOpenReceiptId}
            />
          ))}
        </div>
      );
    }
  }
};

export default Receipts;
