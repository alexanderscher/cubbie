"use client";
import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/components/buttons/RegularButton";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import HeaderNav from "@/components/navbar/HeaderNav";
import ImageModal from "@/components/images/ImageModal";
import { AddItem } from "@/components/item/AddItem";
import { Item as ItemType, Receipt } from "@/types/AppTypes";
import * as Yup from "yup";
import { addItem } from "@/actions/items/addItem";
import { ReceiptOptionsModal } from "@/components/options/ReceiptOptions";
import { Overlay } from "@/components/overlays/Overlay";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import Filters from "@/components/headers/Filters";
import { TruncateText } from "@/components/text/Truncate";
import { useSearchParams } from "next/navigation";
import { NoItems } from "@/components/item/NoItems";
import Item from "@/components/Item";

interface ReceiptIdProps {
  receipt: Receipt;
}

const ReceiptId = ({ receipt }: ReceiptIdProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isOptionsOpen, setisOptionsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openItemId, setOpenItemId] = useState(null as number | null);
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const [filteredItemData, setFilteredItemData] = useState(receipt.items);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const itemSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
  });
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

  const filterItems = (searchTerm: string) => {
    const filteredItems = sortedAndFilteredData.filter((item) => {
      return item.description.toLowerCase().includes(searchTerm.toLowerCase());
    });

    setFilteredItemData(filteredItems);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    filterItems(newSearchTerm);
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full max-w-[1090px] ">
      <HeaderNav receipt={receipt} />
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
          <RegularButton
            styles="border-emerald-900 text-white bg-emerald-900 text-xs"
            handleClick={() => {
              setDetailsOpen(true);
            }}
          >
            <p>Receipt details</p>
          </RegularButton>
          <div
            className={`relative hover:border-[1px] hover:border-emerald-900 px-4 py-1 rounded-full cursor-pointer flex items-center ${
              isOpen && "border-[1px] border-emerald-900 px-4 py-1 rounded-full"
            }`}
            onClick={() => setisOptionsOpen(!isOptionsOpen)}
          >
            <Image src="/three-dots.png" alt="" width={20} height={20} />
            {isOptionsOpen && (
              <>
                <Overlay onClose={() => setIsOpen(false)} />
                <ReceiptOptionsModal receipt={receipt} />
              </>
            )}
          </div>
        </div>
        {isDetailsOpen && (
          <ModalOverlay onClose={() => setDetailsOpen(false)}>
            <ReceiptDetails receipt={receipt} />
          </ModalOverlay>
        )}
      </div>

      <div className="w-full">
        <input
          className="searchBar border-[1px] border-emerald-900 placeholder:text-emerald-900 placeholder:text-xs flex items-center text-sm text-emerald-900 p-3"
          placeholder={`Search items from ${receipt.store}`}
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
      <Items filteredItemData={filteredItemData} receipt={receipt} />
      {/* <div className={`${styles.receipt} pb-[200px]`}>
        {receipt.items.length > 0 && (
          <div
            className={`flex flex-col gap-2 pb-[200px] ${styles.boxContainer}`}
          >
            <div className={`${styles.boxes} `}>
              {isClient &&
                filteredItemData.length > 0 &&
                filteredItemData.map((item: ItemType, index: number) => (
                  <Item
                    project={receipt.project}
                    key={item.id}
                    item={item}
                    isOpen={openItemId === item.id}
                    onToggleOpen={(e) => toggleOpenItem(item.id, e)}
                    setOpenItemId={setOpenItemId}
                  />
                ))}
            </div>
          </div>
        )}
        {receipt.items.length === 0 && (
          <div className={`${styles.placeholder} shadow`}>
            <div className="w-full  flex justify-center items-center">
              <Image
                src="/item_b.png"
                alt=""
                width={60}
                height={60}
                className="object-cover "
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>

            <RegularButton
              styles={
                "bg-emerald-900 text-white text-xs w-1/2  border-emerald-900"
              }
              handleClick={() => {
                setIsAddOpen(true);
              }}
            >
              Add Item
            </RegularButton>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default ReceiptId;

const ReceiptDetails = ({ receipt }: { receipt: Receipt }) => {
  const [isOpen, setIsOpen] = useState(false);

  const total_amount = receipt.items.reduce((acc: number, curr: ItemType) => {
    return acc + curr.price;
  }, 0);

  return (
    <div
      className={`shadow rounded-lg bg-white flex flex-col gap-4 p-8 overflow-auto h-[600px] w-[400px]`}
    >
      {!receipt.receipt_image_url && (
        <div className="w-full flex justify-center items-center  ">
          <div className="  overflow-hidden">
            <Image
              src="/receipt_b.png"
              alt=""
              width={40}
              height={40}
              className="object-cover bg-white pt-4"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
      )}

      {receipt.receipt_image_url && (
        <div className="w-full flex justify-center items-center  ">
          <div className=" w-[200px] max-h-[200px]  rounded-lg overflow-hidden">
            <Image
              src={receipt.receipt_image_url}
              width={280}
              height={280}
              alt="Receipt Image"
              className="object-contain rounded-lg cursor-pointer"
              layout="intrinsic"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      )}
      <ImageModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        imageUrl={receipt.receipt_image_url}
        altText="Your Image Description"
      />

      <div className="flex flex-col gap-4 text-sm ">
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Return Date</p>
          <p className="">{formatDateToMMDDYY(receipt.return_date)}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Date Purcashed</p>
          <p className="">{formatDateToMMDDYY(receipt.purchase_date)}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Total Amount</p>
          <p className="">{formatCurrency(total_amount)}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Receipt Type</p>
          <p className="">{receipt.memo ? "Memo" : "Receipt"}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Quantity</p>
          <p className="">{receipt.items.length}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Created on</p>
          <p className="">{formatDateToMMDDYY(receipt.created_at)}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Purchase Type</p>
          <p className="">{receipt.type}</p>
        </div>

        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Card</p>
          <p className="">{receipt.card ? receipt.card : "None"}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Project Asset Amount</p>
          <p className="">
            {receipt.project &&
            receipt.project.asset_amount !== null &&
            receipt.project.asset_amount !== undefined
              ? receipt.project.asset_amount
              : "None"}
          </p>
        </div>

        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Tracking Link</p>
          <p className="">
            {receipt.tracking_number ? receipt.tracking_number : "None"}
          </p>
        </div>
      </div>
    </div>
  );
};

const Items = ({
  filteredItemData,
  receipt,
}: {
  filteredItemData: ItemType[];
  receipt: Receipt;
}) => {
  console.log(filteredItemData);
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

  const [openItemId, setOpenItemId] = useState(null as number | null);

  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let filteredData = filteredItemData.filter((item: ItemType) => {
    if (type === "expired") {
      return receipt.expired;
    } else if (type === "active") {
      return !receipt.expired;
    }
    return true;
  });

  if (status === "returned" || status === "current") {
    filteredData = filteredData.filter((item: ItemType) =>
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
        {filteredData.map((item: ItemType) => (
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
      {filteredData.map((item: ItemType) => (
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
