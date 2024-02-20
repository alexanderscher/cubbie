"use client";
import styles from "./itemID.module.css";

import { useParams } from "next/navigation";
import { Item as ItemType } from "@/types/receipt";
import React, { useEffect, useState } from "react";
import RegularButton from "@/app/components/buttons/RegularButton";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";

const ItemID = () => {
  const { id } = useParams();

  const [item, setItem] = useState({} as ItemType);

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      setItem(data.item);
    };
    fetchItem();
  }, [id]);

  if (!item.receipt) return <div>Loading</div>;
  return (
    <div className="flex flex-col gap-6  max-w-[1000px]">
      <div className="flex justify-between w-full ">
        <h1 className="text-2xl text-orange-600">{item.description}</h1>
        <RegularButton styles="bg-emerald-900">
          <p className="text-white text-sm">Edit</p>
        </RegularButton>
      </div>

      <div className={`${styles.receipt}`}>
        <div
          className={`w-full sm:w-1/2 border-emerald-900 border-[1.5px] rounded-md p-6 bg-white flex flex-col gap-4`}
        >
          {" "}
          <p className="">Item Info</p>
          {!item.photo_url && (
            <div className="w-full  overflow-hidden relative flex justify-center items-center ">
              <div className="w-full h-full flex justify-center items-start ">
                <Image
                  src="/clothes.png"
                  alt=""
                  width={50}
                  height={50}
                  className="object-cover bg-white"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>
            </div>
          )}
          {item.photo_url && (
            <div className="w-full h-[300px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col rounded-sm">
              <Image
                src={item.photo_url}
                alt=""
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-t-sm"
                style={{ objectPosition: "top" }}
              />
            </div>
          )}
          <div className="w-full  border-emerald-900 border-b-[1.5px]   pb-2">
            <p className="text-xs">Store</p>
            <p>{item.receipt.store}</p>
          </div>
          <div className="w-full  border-emerald-900 border-b-[1.5px]   pb-2">
            <p className="text-xs">Store</p>
            <p>{item.receipt.store}</p>
          </div>
          <div className="w-full  border-emerald-900 border-b-[1.5px]   pb-2">
            <p className="text-xs">Store</p>
            <p>{item.receipt.store}</p>
          </div>
          <div className="w-full  border-emerald-900 border-b-[1.5px]   pb-2">
            <p className="text-xs">Store</p>
            <p>{item.receipt.store}</p>
          </div>
          <div className="w-full  border-emerald-900 border-b-[1.5px]   pb-2">
            <p className="text-xs">Store</p>
            <p>{item.receipt.store}</p>
          </div>
        </div>
        <div className={` w-full sm:w-1/2`}>
          <div className={`${styles.receiptLeft}  flex flex-col gap-2`}>
            <div
              className={` border-emerald-900 border-[1.5px] rounded-md p-6 bg-white flex flex-col gap-4`}
            >
              <p className="">Recipt Info</p>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex flex-col gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Updated at</p>
                    <p>{formatDateToMMDDYY(item.receipt.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Receipt Type</p>
                    <p>{item.receipt.type}</p>
                  </div>

                  {item.receipt.card ? (
                    <div>
                      <p className="text-slate-500">Card used</p>
                      <p>{item.receipt.card}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-500">Card used</p>
                      <p>None</p>
                    </div>
                  )}
                  {item.receipt.tracking_number ? (
                    <div>
                      <p className="text-slate-500">Tracking Link</p>
                      <p>{item.receipt.tracking_number}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-slate-500">Tracking Link</p>
                      <p>None</p>
                    </div>
                  )}
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
