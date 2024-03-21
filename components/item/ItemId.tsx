"use client";
import { useParams } from "next/navigation";
import { Item as ItemType } from "@/types/receiptTypes";
import React, { useState } from "react";
import RegularButton from "@/components/buttons/RegularButton";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import HeaderItemNav from "@/components/navbar/HeaderItemNav";
import ImageModal from "@/components/images/ImageModal";

interface ItemIDProps {
  item: ItemType;
}

const ItemID = ({ item }: ItemIDProps) => {
  const { id } = useParams();

  const [isOpen, setIsOpen] = useState(false);

  if (!item.receipt) return <div className="min-h-screen">Loading</div>;
  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col gap-6  w-full max-w-[600px] ">
        <HeaderItemNav item={item} />

        <div className="w-full flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-xl text-orange-600">{item.description}</p>
            <RegularButton styles="bg-emerald-900" href={`/item/${id}/edit`}>
              <p className="text-white text-xs">Edit</p>
            </RegularButton>
          </div>

          {item.photo_url && (
            <div className="w-full   ">
              <div className="max-h-[300px] w-full overflow-hidden rounded-md">
                <Image
                  src={item.photo_url}
                  width={600}
                  height={300}
                  alt="Receipt Image"
                  className="w-full h-full object-cover cursor-pointer"
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

          {!item.photo_url && (
            <div className="max-h-[300px] w-full overflow-hidden rounded-md">
              <div className="w-full h-[110px] overflow-hidden relative flex justify-center items-center bg-white">
                <div className="w-full h-full flex justify-center items-center">
                  <Image
                    src="/item_b.png"
                    alt=""
                    width={60}
                    height={60}
                    className="object-cover "
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {item.receipt.asset_amount &&
          item.receipt.asset_amount < item.price && (
            <p className="text-md text-emerald-900">Asset</p>
          )}

        <div className="flex flex-col gap-4">
          <div className="w-full  bg-white rounded-md shadow p-4 ">
            <p className="text-xs text-slate-400">Store</p>
            <p>{item.receipt.store}</p>
          </div>
          <div className="w-full  bg-white rounded-md shadow p-4 ">
            <p className="text-xs text-slate-400">Price</p>
            <p>{formatCurrency(item.price)}</p>
          </div>
          <div className="w-full  bg-white rounded-md shadow p-4 ">
            <p className="text-xs text-slate-400">Barcode</p>
            <p>{item.barcode ? item.barcode : "None"}</p>
          </div>
          <div className="w-full  bg-white rounded-md shadow p-4 ">
            <p className="text-xs text-slate-400">Character</p>
            <p>{item.character ? item.character : "None"}</p>
          </div>
          <div className="w-full  bg-white rounded-md shadow p-4 ">
            <p className="text-xs text-slate-400">Product ID</p>
            <p>{item.product_id ? item.product_id : "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemID;
