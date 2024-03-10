"use client";
import { markAsReturned, unreturn } from "@/app/actions/return";
import RegularButton from "@/app/components/buttons/RegularButton";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item as ItemType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import path from "path";
import React, { useState } from "react";

interface Props {
  item: ItemType;
  isOpen: boolean;
  onToggleOpen: () => void;
}

const Item = ({ item, isOpen, onToggleOpen }: Props) => {
  const pathname = usePathname();
  console.log(item);

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
              onClick={onToggleOpen}
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
              onClick={onToggleOpen}
            />
          </div>
        )}
        <div className="p-3 flex flex-col  ">
          {/* {item.receipt.project && (
            <p className="text-xs text-emerald-900 mb-1">
              {item.receipt.project.name}
            </p>
          )} */}
          <div className="">
            <Link href={`/item/${item.id}`} className="">
              <TruncateText
                text={item.description}
                maxLength={18}
                styles={"text-orange-600 text-sm"}
              />
            </Link>
            {/* {pathname === "/items" && (
              <div className="text-xs">
                <p className=" ">
                  Return by {formatDateToMMDDYY(item.receipt.return_date)}
                </p>
              </div>
            )} */}
          </div>

          <div className="pt-2">
            <div className=" flex flex-col  gap-1 text-xs ">
              {pathname === "/items" && (
                <div className="">
                  <p className="text-slate-400  ">Store</p>
                  <Link href={`/receipt/${item.receipt_id}`} className="">
                    <TruncateText
                      text={item.receipt.store}
                      maxLength={15}
                      styles={""}
                    />
                  </Link>
                </div>
              )}

              <div className="">
                <p className="text-slate-400  ">Price</p>
                <p className="">{formatCurrency(item.price)}</p>
              </div>
              {pathname.includes("receipt") && (
                <div className="">
                  <p className="text-slate-400  ">Barcode</p>
                  <p className="">{item.barcode ? item.barcode : "None"}</p>
                </div>
              )}
              {pathname === "/items" && item.receipt.expired && (
                <p className="text-orange-600">Expired</p>
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
          <p>In possesion</p>
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
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { setRefreshData } = useSearchItemContext();

  const deleteItem = async () => {
    const res = await fetch(`/api/items/${item.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.ok) {
      setRefreshData(true);
    } else {
      console.error("Failed to delete item:", data);
    }
  };

  return (
    <div className="absolute bg-white shadow-1 -right-2 top-6 rounded-md  w-[200px]">
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2">
          <Link href={`/item/${item.id}/edit`}>
            <div className="flex gap-2">
              <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
              <p>Edit</p>
            </div>
          </Link>
        </div>

        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2">
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
        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2 ">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete</p>
          </div>
          {deleteOpen && (
            <DeleteModal
              deleteOpen={deleteOpen}
              setDeleteOpen={setDeleteOpen}
              item={item}
              deleteItem={deleteItem}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  deleteOpen: boolean;
  setDeleteOpen: (value: boolean) => void;
  item: ItemType;
  deleteItem: () => void;
}

const DeleteModal = ({ item, deleteItem, setDeleteOpen }: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded border-emerald-900 border-[1px]">
        <h2 className="text-orange-600">
          Are you sure you want to delete {item.description}?
        </h2>

        <div className="mt-4 flex justify-between">
          <RegularButton
            handleClick={() => setDeleteOpen(false)}
            styles="bg-white text-emerald-900 text-base font-medium rounded-full w-auto border-[1px] border-emerald-900 text-xs"
          >
            Cancel
          </RegularButton>
          <RegularButton
            handleClick={deleteItem}
            styles="bg-emerald-900 text-white text-base font-medium rounded-full w-auto border-[1px] border-emerald-900 text-xs"
          >
            Confirm
          </RegularButton>
        </div>
      </div>
    </div>
  );
};
