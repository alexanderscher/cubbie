"use client";
import styles from "./itemID.module.css";

import { useParams } from "next/navigation";
import { Item as ItemType } from "@/types/receipt";
import React, { useEffect, useState } from "react";
import RegularButton from "@/app/components/buttons/RegularButton";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Shirt from "@/app/components/placeholderImages/Shirt";
import Link from "next/link";
import HeaderItemNav from "@/app/components/navbar/HeaderItemNav";
import ImageModal from "@/app/components/images/ImageModal";
import { TruncateText } from "@/app/components/text/Truncate";

const ItemID = () => {
  const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState({} as ItemType);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      setItem(data.item);
    };
    fetchItem();
  }, [id]);

  if (!item.receipt) return <div className="min-h-screen">Loading</div>;
  return (
    <div className="flex flex-col gap-6  max-w-[1000px] pb-[50px]">
      <HeaderItemNav item={item} />
      <div className="flex justify-between w-full ">
        <h1 className="text-2xl text-orange-600">{item.description}</h1>
        <RegularButton styles="bg-emerald-900" href={`/item/${id}/edit`}>
          <p className="text-white text-xs">Edit</p>
        </RegularButton>
      </div>

      <div className={`${styles.receipt}`}>
        <div
          className={`w-full  rounded-lg p-8 bg-white flex flex-col gap-4  border-[1px] border-emerald-900 `}
        >
          <p className="text-xl text-emerald-900">Item Information</p>
          {!item.photo_url && <Shirt />}
          {item.photo_url && (
            <div className="w-full flex justify-center items-center  ">
              <div className=" max-h-[400px] rounded-lg overflow-hidden">
                <Image
                  src={item.photo_url}
                  width={280}
                  height={280}
                  alt="Receipt Image"
                  className="object-contain rounded-lg cursor-pointer"
                  layout="intrinsic"
                  onClick={() => setIsOpen(true)}
                />
              </div>
              <ImageModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                imageUrl={item.photo_url}
                altText="Your Image Description"
              />
            </div>
          )}

          <div className="w-full  border-slate-400 border-b-[1px]   pb-2">
            <p className="text-xs">Price</p>
            <p>{formatCurrency(item.price)}</p>
          </div>
          <div className="w-full  border-slate-400 border-b-[1px]   pb-2">
            <p className="text-xs">Barcode</p>
            <p>{item.barcode ? item.barcode : "None"}</p>
          </div>
          <div className="w-full  border-slate-400 border-b-[1px]   pb-2">
            <p className="text-xs">Character</p>
            <p>{item.character ? item.character : "None"}</p>
          </div>
          <div className="w-full  border-slate-400 border-b-[1px]   pb-2">
            <p className="text-xs">Product ID</p>
            <p>{item.product_id ? item.product_id : "None"}</p>
          </div>
        </div>
        <div className={`w-full`}>
          <div className={`${styles.receiptLeft}  flex flex-col gap-2`}>
            <div
              className={` rounded-lg p-8 bg-white flex flex-col gap-4  border-[1px] border-emerald-900 `}
            >
              <p className="text-xl text-emerald-900">Receipt Information</p>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-4 text-sm">
                  <div className="border-slate-400 border-b-[1px] ">
                    <p className="text-slate-400">Store</p>
                    <p>{item.receipt.store}</p>
                  </div>
                  <div className="border-slate-400 border-b-[1px] ">
                    <p className="text-slate-400">Created at</p>
                    <p>{formatDateToMMDDYY(item.receipt.created_at)}</p>
                  </div>
                  <div className="border-slate-400 border-b-[1px] ">
                    <p className="text-slate-400">Receipt Type</p>
                    <p>{item.receipt.type}</p>
                  </div>

                  <div className="border-slate-400 border-b-[1px] ">
                    <p className="text-slate-400">Card used</p>
                    <p>{item.receipt.card ? item.receipt.card : "None"}</p>
                  </div>

                  <div className="border-slate-400 border-b-[1px] ">
                    <p className="text-slate-400">Tracking Link</p>
                    <p>
                      {item.receipt.tracking_number
                        ? item.receipt.tracking_number
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemID;
