"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Item from "@/components/Item";
import { Item as ItemType } from "@/types/AppTypes";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import Image from "next/image";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import PageLoading from "@/components/Loading/PageLoading";

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
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <PageLoading loading={isItemLoading} />
      </div>
    );
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

const NoItems = ({
  setAddReceiptOpen,
  addReceiptOpen,
}: {
  setAddReceiptOpen: (value: boolean) => void;
  addReceiptOpen: boolean;
}) => {
  return (
    <div className="box relative">
      <div className="flex flex-col gap-4 justify-center items-center p-6">
        <Image
          src="/item_b.png"
          alt=""
          width={50}
          height={50}
          className="object-cover "
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <p className="text-md text-emerald-900">No items</p>
        <button
          className="border-[1px]  border-emerald-900 py-2 px-10 text-xs text-emerald-900 rounded-full w-full"
          onClick={() => setAddReceiptOpen(true)}
        >
          <p className="">Create</p>
        </button>
        {addReceiptOpen && (
          <ModalOverlay onClose={() => setAddReceiptOpen(false)}>
            <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
          </ModalOverlay>
        )}
      </div>
    </div>
  );
};
