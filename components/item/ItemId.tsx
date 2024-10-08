"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import HeaderItemNav from "@/components/navbar/HeaderItemNav";
import ImageModal from "@/components/images/ImageModal";
import { formatDateToMMDDYY } from "@/utils/Date";
import { ItemOptionsModal } from "@/components/options/ItemsOptions";
import { Overlay } from "@/components/overlays/Overlay";
import { TruncateText } from "@/components/text/Truncate";
import { BeatLoader } from "react-spinners";
import { useSearchItemContext } from "@/components/context/SearchItemContext";

const ItemID = () => {
  const { item, fetchItemById, isItemLoading } = useSearchItemContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    fetchItemById();
  }, [fetchItemById]);

  if (isItemLoading)
    return (
      <div className="h-[90vh] w-full flex items-center justify-center">
        <BeatLoader loading={isItemLoading} size={15} color={"rgb(6 78 59)"} />
      </div>
    );

  return (
    <div className="w-full flex justify-center items-center mb-[200px]">
      <div className="flex flex-col gap-6  w-full max-w-[600px] ">
        <HeaderItemNav item={item} />
        {item.receipt.expired && (
          <div className="bg-destructive/15 p-4 rounded-lg flex items-center gap-x-2 text-sm text-destructive bg-red-100 text-red-500 shadow-sm">
            <p>The receipt for this item has expired</p>
          </div>
        )}

        <div className="w-full flex flex-col gap-4 justify-center">
          <div className="flex justify-between">
            <TruncateText
              text={item.description}
              styles={"text-2xl text-orange-600 "}
            />
            <div className="flex gap-2">
              <div
                className={`relative hover:border-[1px] hover:border-emerald-900 px-4 py-1 rounded-full cursor-pointer flex items-center ${
                  isOpen &&
                  "border-[1px] border-emerald-900 px-4 py-1 rounded-full"
                }`}
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
              >
                <Image
                  src="/black/three-dots.png"
                  alt=""
                  width={20}
                  height={20}
                />
                {isOptionsOpen && (
                  <>
                    <Overlay onClose={() => setIsOptionsOpen(false)} />
                    <ItemOptionsModal item={item} location="ID" />
                  </>
                )}
              </div>
            </div>
          </div>

          {item.photo_url && (
            <div className="relative w-full  bg-white p-6 rounded-lg shadow ">
              {item.receipt.project &&
                item.receipt.project.asset_amount !== null &&
                item.receipt.project.asset_amount !== undefined &&
                item.receipt.project.asset_amount < item.price && (
                  <p className="absolute top-8 left-8 flex  text-orange-600 text-xs border-[1px] border-orange-600 rounded-full px-3 py-1">
                    Asset
                  </p>
                )}
              <div className="max-h-[300px] w-full overflow-hidden rounded-lg">
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
            <div className=" max-h-[300px] w-full overflow-hidden rounded-lg">
              <div className="w-full h-[110px] overflow-hidden relative flex justify-center items-center bg-white">
                {item.receipt.project &&
                  item.receipt.project.asset_amount !== null &&
                  item.receipt.project.asset_amount !== undefined &&
                  item.receipt.project.asset_amount < item.price && (
                    <p className="absolute top-2 left-2 flex  text-orange-600 text-xs border-[1px] border-orange-600 rounded-full px-3 py-1">
                      Asset
                    </p>
                  )}
                <div className="w-full h-full flex justify-center items-center">
                  <Image
                    src="/green/item_green.png"
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

        <div className="flex flex-col gap-4">
          <div className="w-full  bg-white rounded-lg shadow p-4 ">
            <p className="text-xs text-slate-400">Store</p>
            <p>{item.receipt.store}</p>
          </div>
          <div className="w-full  bg-white rounded-lg shadow p-4 ">
            <p className="text-xs text-slate-400">Return Date</p>
            <p>{formatDateToMMDDYY(item.receipt.return_date)}</p>
          </div>
          <div className="w-full  bg-white rounded-lg shadow p-4 ">
            <p className="text-xs text-slate-400">Price</p>
            <p>{formatCurrency(item.price)}</p>
          </div>
          <div className="w-full  bg-white rounded-lg shadow p-4 ">
            <p className="text-xs text-slate-400">Barcode</p>
            <p>{item.barcode ? item.barcode : "None"}</p>
          </div>
          <div className="w-full  bg-white rounded-lg shadow p-4 ">
            <p className="text-xs text-slate-400">Character</p>
            <p>{item.character ? item.character : "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemID;
