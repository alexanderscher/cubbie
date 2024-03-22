"use client";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Receipt from "@/components/receiptComponents/Receipt";
import { Item, Receipt as ReceiptType } from "@/types/receiptTypes";
import Image from "next/image";
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
    return <div>Loading...</div>;
  }
  if (sortedAndFilteredData.length === 0 && !isReceiptLoading) {
    return (
      <NoReceipts
        setAddReceiptOpen={setAddReceiptOpen}
        addReceiptOpen={addReceiptOpen}
      />
    );
  }

  if (searchParams.get("expired") === "false" || !searchParams.get("expired")) {
    return sortedAndFilteredData.filter(
      (receipt: ReceiptType) => receipt.expired === false
    ).length === 0 ? (
      <NoReceipts
        setAddReceiptOpen={setAddReceiptOpen}
        addReceiptOpen={addReceiptOpen}
      />
    ) : (
      <div className="boxes">
        {sortedAndFilteredData
          .filter((receipt: ReceiptType) => receipt.expired === false)
          .map((receipt: ReceiptType) => (
            <Receipt
              key={receipt.id}
              receipt={receipt}
              onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
              isOpen={openReceiptId === receipt.id}
            />
          ))}
      </div>
    );
  } else
    return sortedAndFilteredData.filter(
      (receipt: ReceiptType) => receipt.expired === true
    ).length === 0 ? (
      <NoReceipts
        setAddReceiptOpen={setAddReceiptOpen}
        addReceiptOpen={addReceiptOpen}
      />
    ) : (
      <div className="boxes">
        {sortedAndFilteredData
          .filter((receipt: ReceiptType) => receipt.expired === true)
          .map((receipt: ReceiptType) => (
            <Receipt
              key={receipt.id}
              receipt={receipt}
              onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
              isOpen={openReceiptId === receipt.id}
            />
          ))}
      </div>
    );
};

export default Receipts;

interface NoReceiptsProps {
  setAddReceiptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addReceiptOpen: boolean;
}

const NoReceipts = ({ setAddReceiptOpen, addReceiptOpen }: NoReceiptsProps) => {
  return (
    <div className="flex flex-col gap-6 justify-center items-center mt-10">
      <Image
        src="/receipt_b.png"
        alt=""
        width={30}
        height={30}
        className="object-cover "
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      <p className="text-xl">No receipts found</p>

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
};
