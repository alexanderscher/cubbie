"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Item from "@/components/Item";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import PageLoading from "@/components/Loading/PageLoading";
import { NoItems } from "@/components/item/NoItems";
import { ItemType } from "@/types/ItemsTypes";
import { SelectedBar } from "@/components/Home/SelectedBar";
import { CheckedItems } from "@/types/SelectType";
import Image from "next/image";

const Items = () => {
  const { filteredItemData, isItemLoading, selectItemTrigger, fetchItems } =
    useSearchItemContext();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const searchParams = useSearchParams();
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);
  const [isSelectedOpen, setIsSelectedOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<CheckedItems[]>([]);
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
      <div className="flex flex-col gap-6">
        <SelectedBar
          selectTrigger={selectItemTrigger}
          checkedItems={checkedItems}
          setIsSelectedOpen={setIsSelectedOpen}
          isSelectedOpen={isSelectedOpen}
        >
          <SelectedItemOptions />
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

  if (filteredData.length === 0) {
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
        <SelectedItemOptions />
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

export default Items;

const SelectedItemOptions = () => {
  return (
    <div
      className={`absolute  shadow-lg -right-2 top-10 rounded-lg  z-[2000] w-[200px] bg-white`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // setIsDeleteOpen(true);
            }}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Return Selected</p>
          </div>
        </div>
        <div className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // setIsDeleteOpen(true);
            }}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Return all</p>
          </div>
        </div>
        <div className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // setIsDeleteOpen(true);
            }}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete Selected</p>
          </div>
        </div>
        <div className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // setIsDeleteOpen(true);
            }}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete all</p>
          </div>
        </div>
      </div>
    </div>
  );
};
