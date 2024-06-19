"use client";
import styles from "@/app/receipt/receiptID.module.css";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import HeaderNav from "@/components/navbar/HeaderNav";
import { AddItem } from "@/components/item/AddItem";
import * as Yup from "yup";
import { addItem } from "@/actions/items/addItem";
import { ReceiptOptionsModal } from "@/components/options/ReceiptOptions";
import { Overlay } from "@/components/overlays/Overlay";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import Filters from "@/components/headers/Filters";
import { TruncateText } from "@/components/text/Truncate";
import { useSearchParams } from "next/navigation";
import { NoItems } from "@/components/item/NoItems";
import Item from "@/components/item/Item";
import PageLoading from "@/components/Loading/PageLoading";
import { ReceiptItemType, ReceiptType } from "@/types/ReceiptTypes";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import { CheckedItems } from "@/types/SelectType";
import { SelectedBar } from "@/components/Home/SelectedBar";
import { SelectedItemOptions } from "@/components/selected/SelectedItemOptions";
import { useSearchItemContext } from "@/components/context/SearchItemContext";

const itemSchema = Yup.object({
  description: Yup.string().required("Description is required"),
  price: Yup.string().required("Price is required"),
});

const ReceiptId = () => {
  const { receipt, fetchReceiptById, isReceiptLoading } =
    useSearchReceiptContext();

  const [isOpen, setIsOpen] = useState(false);
  const [isOptionsOpen, setisOptionsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [filteredItemData, setFilteredItemData] = useState<ReceiptItemType[]>(
    receipt.items
  );

  const [newItem, setNewItem] = useState({
    description: "",
    price: "0.00",
    barcode: "",
    character: "",
    photo: "",
    receipt_id: receipt.id,
  });

  const [error, setError] = useState({
    description: "",
    price: "",
    result: "",
  });

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchReceiptById();
  }, [fetchReceiptById]);

  const handleSubmit = async () => {
    try {
      await itemSchema.validate(newItem, { abortEarly: false });

      startTransition(async () => {
        const result = await addItem(newItem);

        if (result?.error) {
          setError({ ...error, result: result.error });
        } else {
          setIsAddOpen(false);

          setNewItem({
            description: "",
            price: "0.00",
            barcode: "",
            character: "",
            photo: "",
            receipt_id: receipt.id,
          });
          setError({
            description: "",
            price: "",
            result: "",
          });
        }
      });
    } catch (error) {
      let errorsObject = {};

      if (error instanceof Yup.ValidationError) {
        errorsObject = error.inner.reduce((acc, curr) => {
          const key = curr.path || "unknownField";
          acc[key] = curr.message;
          return acc;
        }, {} as Record<string, string>);
      }

      setError(
        errorsObject as {
          description: string;
          price: string;
          result: string;
        }
      );
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  useEffect(() => {
    const filterItems = () => {
      const filteredItems = receipt.items.filter((item) => {
        return item.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setFilteredItemData(filteredItems);
    };

    if (receipt.id) {
      filterItems();
    }
  }, [receipt, searchTerm]);

  return (
    <div className="flex flex-col gap-8 w-full h-full max-w-[1090px] ">
      {!isReceiptLoading && <HeaderNav receipt={receipt} />}

      {receipt.expired && (
        <div className="bg-destructive/15 p-3 rounded-lg flex items-center gap-x-2 text-sm text-destructive bg-red-100 text-red-500 shadow">
          <p>This receipt has expired</p>
        </div>
      )}
      <div className={styles.header}>
        <TruncateText
          text={receipt.store}
          styles={"text-2xl text-orange-600 "}
        />
        <div className="flex gap-2">
          <div
            className={`relative hover:border-[1px] hover:border-emerald-900 px-4 py-1 rounded-full cursor-pointer flex items-center ${
              isOpen && "border-[1px] border-emerald-900 px-4 py-1 rounded-full"
            }`}
            onClick={() => setisOptionsOpen(!isOptionsOpen)}
          >
            <Image src="/three-dots.png" alt="" width={20} height={20} />
            {isOptionsOpen && !isReceiptLoading && (
              <>
                <Overlay onClose={() => setIsOpen(false)} />
                <ReceiptOptionsModal receipt={receipt} />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full">
        <input
          className="searchBar border-[1px] border-emerald-900 placeholder:text-emerald-900 placeholder:text-xs flex items-center text-sm text-emerald-900 p-3"
          placeholder={
            !isReceiptLoading ? `Search items from ${receipt.store}` : ""
          }
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
      <Filters />
      {isAddOpen && (
        <ModalOverlay onClose={() => setIsAddOpen(false)}>
          <AddItem
            setIsAddOpen={setIsAddOpen}
            handleSubmit={handleSubmit}
            setNewItem={setNewItem}
            newItem={newItem}
            error={error}
            isPending={isPending}
          />
        </ModalOverlay>
      )}
      {isReceiptLoading && <PageLoading loading={isReceiptLoading} />}

      {filteredItemData && !isReceiptLoading && (
        <Items
          filteredItemData={filteredItemData}
          receipt={receipt}
          setIsAddOpen={setIsAddOpen}
          isReceiptLoading={isReceiptLoading}
        />
      )}
    </div>
  );
};

export default ReceiptId;

const Items = ({
  filteredItemData,
  receipt,
  setIsAddOpen,
  isReceiptLoading,
}: {
  filteredItemData: ReceiptItemType[];
  receipt: ReceiptType;
  setIsAddOpen: (value: boolean) => void;
  isReceiptLoading: boolean;
}) => {
  const { selectItemTrigger } = useSearchItemContext();

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
  const searchParams = useSearchParams();
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<CheckedItems[]>([]);
  const [isSelectedOpen, setIsSelectedOpen] = useState(false);

  const [openItemId, setOpenItemId] = useState(null as number | null);

  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let filteredData = filteredItemData.filter((item: ReceiptItemType) => {
    if (type === "expired") {
      return receipt.expired;
    } else if (type === "active") {
      return !receipt.expired;
    }
    return true;
  });

  if (status === "returned" || status === "current") {
    filteredData = filteredData.filter((item: ReceiptItemType) =>
      status === "returned" ? item.returned : !item.returned
    );

    if (filteredData.length === 0 && !isReceiptLoading) {
      return (
        <NoItems
          setAddReceiptOpen={setAddReceiptOpen}
          addReceiptOpen={addReceiptOpen}
        />
      );
    }

    return (
      <div className="flex flex-col gap-6">
        <SelectedBar
          selectTrigger={selectItemTrigger}
          checkedItems={checkedItems}
          setIsSelectedOpen={setIsSelectedOpen}
          isSelectedOpen={isSelectedOpen}
        >
          <SelectedItemOptions
            setCheckedItems={setCheckedItems}
            checkedItems={checkedItems}
          />
        </SelectedBar>
        <div className="boxes pb-20">
          {filteredData.map((item) => (
            <Item
              setOpenItemId={setOpenItemId}
              key={item.id}
              item={item}
              isOpen={openItemId === item.id}
              onToggleOpen={(e) => toggleOpenItem(item.id, e)}
              setCheckedItems={setCheckedItems}
              checkedItems={checkedItems}
            />
          ))}
        </div>
      </div>
    );
  }

  if (filteredData.length === 0 && !isReceiptLoading) {
    return (
      <NoItems
        setAddReceiptOpen={setIsAddOpen}
        addReceiptOpen={addReceiptOpen}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SelectedBar
        selectTrigger={selectItemTrigger}
        checkedItems={checkedItems}
        setIsSelectedOpen={setIsSelectedOpen}
        isSelectedOpen={isSelectedOpen}
      >
        <SelectedItemOptions
          setCheckedItems={setCheckedItems}
          checkedItems={checkedItems}
        />
      </SelectedBar>
      <div className="boxes pb-20">
        {filteredData.map((item) => (
          <Item
            setOpenItemId={setOpenItemId}
            key={item.id}
            item={item}
            isOpen={openItemId === item.id}
            onToggleOpen={(e) => toggleOpenItem(item.id, e)}
            setCheckedItems={setCheckedItems}
            checkedItems={checkedItems}
          />
        ))}
      </div>
    </div>
  );
};
