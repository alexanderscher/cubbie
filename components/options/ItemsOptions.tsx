"use client";
import { deleteItem } from "@/actions/items/deleteItem";
import { markAsReturned, unreturn } from "@/actions/items/return";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import EditItem from "@/components/item/EditItem";
import Loading from "@/components/loading-components/Loading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { TruncateText } from "@/components/text/Truncate";
import { ItemType } from "@/types/ItemsTypes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

interface OptionsModalProps {
  item: ItemType;
  location?: string;
}

const white = "bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2";
const green = "bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded-lg p-2";

export const ItemOptionsModal = ({ item, location }: OptionsModalProps) => {
  const { reloadItems } = useSearchItemContext();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const [color, setColor] = useState(white);
  const [edit, setEdit] = useState(false);

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
          toast.success("Item deleted successfully");
          reloadItems();
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className={`absolute  shadow-1 -right-2 top-10 rounded-lg  z-[2000] ${
          !pathname.startsWith("/item/") ? " bg-white" : " bg-[#97cb97]"
        } ${location == "ID" ? "w-[200px]" : " w-full md:w-3/4"}`}
      >
        <div className="p-4 rounded text-sm flex flex-col gap-2">
          {pathname === "/items" && (
            <div className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2">
              <Link href={`/receipt/${item.receipt_id}`}>
                <div className="flex gap-4">
                  <Image
                    src={"/green/receipt_green.png"}
                    width={12}
                    height={12}
                    alt=""
                  ></Image>
                  <TruncateText
                    text={item.receipt?.store}
                    styles={"text-md text-emerald-900"}
                  />
                </div>
              </Link>
            </div>
          )}
          <div className={color}>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => {
                setEdit(true);
              }}
            >
              <Image
                src={"/green/edit_green.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
              <p className="text-emerald-900">Edit</p>
            </div>
          </div>

          <div className={color}>
            {item.returned ? (
              <div className="flex gap-2">
                <Image
                  src={"/green/cancelreturn_green.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <button
                  className="text-emerald-900"
                  onClick={async (e) => {
                    startTransition(async () => {
                      try {
                        await unreturn(item.id);
                        toast.success("Item has been marked as not returned.");
                        reloadItems();
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
                  src={"/green/return_green.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <button
                  className="text-emerald-900"
                  onClick={async () => {
                    startTransition(async () => {
                      try {
                        toast.success("Item has been marked as returned.");
                        await markAsReturned(item.id);
                        reloadItems();
                      } catch (e) {
                        toast.error("An error occurred. Please try again.");
                      }
                    });
                  }}
                >
                  Returned
                </button>
              </div>
            )}
          </div>
          <div className={`${color}`}>
            <div
              className="flex gap-2 cursor-pointer"
              onClick={() => {
                setDeleteOpen(true);
              }}
            >
              <Image
                src={"/green/trash_green.png"}
                width={15}
                height={15}
                alt=""
              ></Image>
              <p className="text-emerald-900">Delete </p>
            </div>
          </div>
        </div>
      </div>
      {edit && (
        <ModalOverlay onClose={() => setEdit(false)}>
          <EditItem itemId={item.id.toString()} setEdit={setEdit} />
        </ModalOverlay>
      )}
      {isPending && <Loading loading={isPending} />}
      <div className="z-[2000]">
        {deleteOpen && (
          <ModalOverlay isDelete={true} onClose={() => setDeleteOpen(false)}>
            <DeleteConfirmationModal
              cancelClick={setDeleteOpen}
              deleteClick={deleteMethod}
              isPending={isPending}
              type="Item"
              message={`Are you sure you want to delete ${item.description}? This will delete all receipts and items in the project.`}
            />
          </ModalOverlay>
        )}
      </div>
    </div>
  );
};
