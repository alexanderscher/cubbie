"use client";
import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/components/buttons/RegularButton";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import HeaderNav from "@/components/navbar/HeaderNav";
import ImageModal from "@/components/images/ImageModal";
import { AddItem } from "@/components/item/AddItem";
import Item from "@/components/Item";
import { Item as ItemType, Receipt } from "@/types/AppTypes";
import * as Yup from "yup";
import { addItem } from "@/actions/items/addItem";
import { ReceiptOptionsModal } from "@/components/options/ReceiptOptions";

interface ReceiptIdProps {
  receipt: Receipt;
}

const ReceiptId = ({ receipt }: ReceiptIdProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOptionsOpen, setisOptionsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [openItemId, setOpenItemId] = useState(null as number | null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleOpenItem = (
    itemId: number | undefined,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (itemId === undefined) return;

    if (openItemId === itemId) {
      setOpenItemId(null);
    } else {
      setOpenItemId(itemId);
    }
  };
  const total_amount = receipt.items.reduce((acc: number, curr: ItemType) => {
    return acc + curr.price;
  }, 0);

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

  if (!receipt.items) return <div className="min-h-screen">Loading</div>;
  return (
    <div className="flex flex-col gap-8 w-full h-full max-w-[1260px] ">
      <HeaderNav receipt={receipt} />
      {receipt.expired && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive bg-red-100 text-red-500 shadow">
          <p>This receipt has expired</p>
        </div>
      )}
      <div className={styles.header}>
        <h1 className="text-2xl text-orange-600 ">{receipt.store}</h1>
        <div
          className={`relative hover:border-[1px] hover:border-emerald-900 px-4 py-1 rounded-full cursor-pointer flex items-center ${
            isOpen && "border-[1px] border-emerald-900 px-4 py-1 rounded-full"
          }`}
          onClick={() => setisOptionsOpen(!isOptionsOpen)}
        >
          <Image src="/three-dots.png" alt="" width={20} height={20} />
          {isOptionsOpen && <ReceiptOptionsModal receipt={receipt} />}
        </div>

        {/* <div className="flex gap-2 ">
          <RegularButton
            styles="bg  border-emerald-900"
            handleClick={() => setIsAddOpen(true)}
          >
            <p className="text-emerald-900 text-xs">Add item</p>
          </RegularButton>

          <div
            className={`relative hover:border-[1px] hover:border-emerald-900 px-4 py-1 rounded-full cursor-pointer flex items-center ${
              isOpen && "border-[1px] border-emerald-900 px-4 py-1 rounded-full"
            }`}
            onClick={() => setisOptionsOpen(!isOptionsOpen)}
          >
            <Image src="/three-dots.png" alt="" width={20} height={20} />
            {isOptionsOpen && <ReceiptOptionsModal receipt={receipt} />}
          </div>
        </div> */}
      </div>
      {isAddOpen && (
        <AddItem
          setIsAddOpen={setIsAddOpen}
          handleSubmit={handleSubmit}
          setNewItem={setNewItem}
          newItem={newItem}
          error={error}
          isPending={isPending}
        />
      )}
      <div className="flex bg-white  rounded-md text-sm shadow p-6 h-[80px] items-center">
        <div className="w-1/3 border-r-[1px] border-slate-300  ">
          <p className="text-slate-400 text-xs">Total amount</p>
          <p>{formatCurrency(total_amount)}</p>
        </div>
        <div className="w-1/3 border-r-[1px] border-slate-300 pl-2 pr-2">
          <p className="text-slate-400 text-xs">Purchase Date</p>
          <p>{formatDateToMMDDYY(receipt.purchase_date)}</p>
        </div>

        <div className="pl-2 pr-2">
          <p className="text-slate-400 text-xs">Return Date</p>
          <p>{formatDateToMMDDYY(receipt.return_date)}</p>
        </div>
      </div>
      <div className={`${styles.receipt} pb-[200px]`}>
        <div className={`${styles.receiptLeft} shadow  flex flex-col gap-2`}>
          <div
            className={`shadow rounded-md  bg-white flex flex-col gap-4 p-8   `}
          >
            {!receipt.receipt_image_url && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                <div className="w-full h-full flex justify-center items-start ">
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
                <div className=" w-[200px] max-h-[200px]  rounded-md overflow-hidden">
                  <Image
                    src={receipt.receipt_image_url}
                    width={280}
                    height={280}
                    alt="Receipt Image"
                    className="object-contain rounded-md cursor-pointer"
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
        </div>
        {receipt.items.length > 0 && (
          <div
            className={`flex flex-col gap-2 pb-[200px] ${styles.boxContainer}`}
          >
            <div className={`${styles.boxes} `}>
              {isClient &&
                receipt.items.length > 0 &&
                receipt.items.map((item: ItemType, index: number) => (
                  <Item
                    project={receipt.project}
                    key={item.id}
                    item={item}
                    isOpen={openItemId === item.id}
                    onToggleOpen={(e) => toggleOpenItem(item.id, e)}
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
      </div>
    </div>
  );
};

export default ReceiptId;
