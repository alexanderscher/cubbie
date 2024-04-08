"use client";
import { deleteItem } from "@/actions/items/deleteItem";
import { markAsReturned, unreturn } from "@/actions/return";
import Loading from "@/components/Loading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { TruncateText } from "@/components/text/Truncate";
import { Item as ItemType } from "@/types/AppTypes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface OptionsModalProps {
  item: ItemType;
}

const white = "bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2";
const green = "bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2";

export const ItemOptionsModal = ({ item }: OptionsModalProps) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [color, setColor] = useState(white);

  useEffect(() => {
    if (!pathname.startsWith("/item/")) {
      setColor(white);
    } else {
      setColor(green);
    }
  }, [pathname]);

  const deleteMethod = () => {
    startTransition(async () => {
      try {
        const result = await deleteItem(item.id);

        if (result?.error) {
          toast.error("An error occurred. Please try again.");
        } else {
          setDeleteOpen(false);
          toast.success("Your operation was successful!");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <div
      className={`absolute  shadow-1 -right-2 top-10 rounded-md w-[200px] ${
        !pathname.startsWith("/item/")
          ? "z-200 bg-white"
          : "z-[500] bg-[#97cb97] "
      }`}
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        {pathname === "/items" && (
          <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2">
            <Link href={`/receipt/${item.receipt_id}`}>
              <div className="flex gap-4">
                <Image
                  src={"/receipt_b.png"}
                  width={12}
                  height={12}
                  alt=""
                ></Image>
                <TruncateText
                  text={item.receipt?.store}
                  maxLength={15}
                  styles={"text-md"}
                />
              </div>
            </Link>
          </div>
        )}
        {!pathname.startsWith("/item/") && (
          <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2">
            <Link href={`/item/${item.id}/edit`}>
              <div className="flex gap-2">
                <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
                <p>Edit</p>
              </div>
            </Link>
          </div>
        )}

        <div className={color}>
          {item.returned ? (
            <div className="flex gap-2">
              <Image
                src={"/undoReturn.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
              <button
                onClick={async (e) => {
                  startTransition(async () => {
                    try {
                      await unreturn(item.id);
                      toast.success("Your operation was successful!");
                    } catch (e) {
                      toast.error("An error occurred. Please try again.");
                    }
                  });
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
                  startTransition(async () => {
                    try {
                      toast.success("Your operation was successful!");
                      await markAsReturned(item.id);
                    } catch (e) {
                      toast.error("An error occurred. Please try again.");
                    }
                  });
                }}
              >
                Mark as Returned
              </button>
            </div>
          )}
        </div>
        <div className={color}>
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => {
              setDeleteOpen(true);
            }}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete Item</p>
          </div>
          {deleteOpen && (
            <DeleteConfirmationModal
              cancelClick={setDeleteOpen}
              deleteClick={deleteMethod}
              isPending={isPending}
              type="Item"
              message={`Are you sure you want to delete ${item.description}? This will delete all receipts and items in the project.`}
            />
          )}
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
