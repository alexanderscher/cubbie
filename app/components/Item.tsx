"use client";
import { markAsReturned, unreturn } from "@/app/actions/return";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item as ItemType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
  item: ItemType;
}

const Item = ({ item }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);

  return (
    <div className="box justify-between relative">
      <div className="">
        {item.photo_url && (
          <div className="w-full h-[110px] overflow-hidden  flex justify-center flex-shrink-0 flex-col">
            <Image
              src={item.photo_url}
              alt=""
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-t-lg"
              style={{ objectPosition: "top" }}
            />
            <Image
              src="/three-dots.png"
              className="absolute top-0 right-2 cursor-pointer "
              alt=""
              width={20}
              height={20}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        )}
        {isOpen && <OptionsModal isOpen={isOpen} item={item} />}
        {!item.photo_url && (
          <div className="">
            <Shirt />
            <Image
              src="/three-dots.png"
              className="absolute top-0 right-2 cursor-pointer "
              alt=""
              width={20}
              height={20}
            />
            <Image
              src="/three-dots.png"
              className="absolute top-0 right-2 cursor-pointer "
              alt=""
              width={20}
              height={20}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        )}
        <div className="p-3 flex flex-col  ">
          <Link href={`/item/${item.id}`} className="">
            <TruncateText
              text={item.description}
              maxLength={18}
              styles={"text-orange-600 text-sm"}
            />
          </Link>
          <div className="text-xs">
            <p className="text-slate-400  ">
              Return by {formatDateToMMDDYY(item.receipt.return_date)}
            </p>
          </div>

          <div>
            <div className="border-t-[1px] border-slate-300 flex flex-col  gap-1 text-xs">
              <div className="mt-2">
                <p className="text-slate-400  ">Store</p>
                <Link href={`/receipt/${item.receipt_id}`} className="">
                  <TruncateText
                    text={item.receipt.store}
                    maxLength={15}
                    styles={""}
                  />
                </Link>
              </div>

              <div className="">
                <p className="text-slate-400  ">Price</p>
                <p className="">{formatCurrency(item.price)}</p>
              </div>
              {item.barcode && (
                <div className="">
                  <p className="text-slate-400  ">Barcode</p>
                  <p className="">{item.barcode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          item.returned
            ? "border-t-orange-600 text-orange-600"
            : "border-t-emerald-900"
        } border-t-[1px] text-xs text-center  text-emerald-900 p-2`}
      >
        {item.returned ? (
          <p>
            <p className="text-orange-600">Returned</p>
          </p>
        ) : (
          <p>Active</p>
        )}
      </div>
    </div>
  );
};

export default Item;

interface OptionsModalProps {
  isOpen: boolean;
  item: ItemType;
}

const OptionsModal = ({ isOpen, item }: OptionsModalProps) => {
  const { setRefreshData } = useSearchItemContext();

  return (
    <div className="absolute bg-white shadow-1 -right-2 top-6 rounded-md  w-[200px]">
      <div className="p-4 rounded-lg text-sm flex flex-col gap-2">
        <div className="bg-slate-100 rounded-md w-full p-2">
          <Link href={`item/${item.id}/edit`}>
            <div className="flex gap-2">
              <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
              <p>Edit</p>
            </div>
          </Link>
        </div>

        <div className="bg-slate-100 rounded-md w-full p-2">
          <div className="flex gap-2">
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete</p>
          </div>
        </div>
        <div className="bg-slate-100 rounded-md w-full p-2">
          {item.returned ? (
            <div className="flex gap-2">
              <Image
                src={"/undoReturn.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
              <button
                onClick={async () => {
                  const { ok, data } = await unreturn(item.id);
                  if (ok) {
                    setRefreshData(true);
                  } else {
                    console.error("Failed to unreturn", data);
                  }
                }}
              >
                <p className="">Undo Return</p>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Image
                src={"/returned.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
              <button
                onClick={async () => {
                  const { ok, data } = await markAsReturned(item.id);
                  if (ok) {
                    setRefreshData(true);
                  } else {
                    console.error("Failed to mark as returned:", data);
                  }
                }}
              >
                Mark as Returned
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
