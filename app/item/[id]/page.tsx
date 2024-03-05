"use client";
import { useParams } from "next/navigation";
import { Item as ItemType } from "@/types/receipt";
import React, { useEffect, useState } from "react";
import RegularButton from "@/app/components/buttons/RegularButton";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import HeaderItemNav from "@/app/components/navbar/HeaderItemNav";
import ImageModal from "@/app/components/images/ImageModal";

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
              <div className="max-h-[300px] w-full overflow-hidden rpunded-md">
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
              <div className="w-full h-[110px] overflow-hidden relative flex justify-center items-center bg-slate-100 ">
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
          <div className="w-full   bg-white rounded-md shadow p-2   pb-2">
            <p className="text-xs text-slate-400">Store</p>
            <p>{item.receipt.store}</p>
          </div>
          <div className="w-full   bg-white rounded-md shadow p-2   pb-2">
            <p className="text-xs text-slate-400">Price</p>
            <p>{formatCurrency(item.price)}</p>
          </div>
          <div className="w-full   bg-white rounded-md shadow p-2   pb-2">
            <p className="text-xs text-slate-400">Barcode</p>
            <p>{item.barcode ? item.barcode : "None"}</p>
          </div>
          <div className="w-full   bg-white rounded-md shadow p-2   pb-2">
            <p className="text-xs text-slate-400">Character</p>
            <p>{item.character ? item.character : "None"}</p>
          </div>
          <div className="w-full   bg-white rounded-md shadow p-2   pb-2">
            <p className="text-xs text-slate-400">Product ID</p>
            <p>{item.product_id ? item.product_id : "None"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemID;
