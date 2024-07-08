import {
  deleteAllItems,
  deleteSelectedItems,
  returnAllItems,
  returnSelectedItems,
  unreturnSelectedItems,
} from "@/actions/select/selectedItems";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import Loading from "@/components/loading-components/Loading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { CheckedItems } from "@/types/SelectType";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface SelectedItemOptionsProps {
  setCheckedItems: React.Dispatch<React.SetStateAction<CheckedItems[]>>;
  checkedItems: CheckedItems[];
}

export const SelectedItemOptions = ({
  setCheckedItems,
  checkedItems,
}: SelectedItemOptionsProps) => {
  const { reloadItems } = useSearchItemContext();
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);

  const returnSelected = () => {
    const itemIds = checkedItems.map((item) => item.item_id);
    startTransition(async () => {
      try {
        if (searchParams.get("status") == "current") {
          returnSelectedItems(itemIds);
          toast.success("Items returned");
        }
        if (searchParams.get("status") == "returned") {
          unreturnSelectedItems(itemIds);
          toast.success("Items unreturned");
        }

        setCheckedItems([]);
        reloadItems();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const returnAll = () => {
    const searchParam = searchParams.get("status");
    if (searchParam == "current" || searchParam == "returned") {
      startTransition(async () => {
        try {
          returnAllItems(searchParam);
          setCheckedItems([]);
          reloadItems();
          if (searchParam == "current") {
            toast.success("Items returned");
          } else {
            toast.success("Items unreturned");
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  };

  const deleteSelected = () => {
    startTransition(async () => {
      try {
        const receiptIds = checkedItems.map((item) => item.item_id);
        await deleteSelectedItems(receiptIds);
        setCheckedItems([]);
        reloadItems();
        toast.success("Projects deleted successfully");
      } catch (error) {
        toast.error("Error deleting receipts");
      }
    });
  };

  const deleteAll = () => {
    startTransition(async () => {
      try {
        await deleteAllItems();
        setCheckedItems([]);
        reloadItems();
        toast.success("Items deleted successfully");
      } catch (error) {
        toast.error("Error deleting items");
      }
    });
  };

  return (
    <div
      className={`absolute  shadow-lg -right-2 top-10 rounded-lg  z-[2000] w-[200px] bg-white`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        {searchParams.get("status") == "current" && (
          <>
            <div
              className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
              onClick={returnSelected}
            >
              <div className="flex gap-2 cursor-pointer">
                <Image
                  src={"/returned.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <p>Return selected</p>
              </div>
            </div>
            <div
              className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
              onClick={returnAll}
            >
              <div className="flex gap-2 cursor-pointer">
                <Image
                  src={"/returned.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <p>Return all</p>
              </div>
            </div>
          </>
        )}
        {searchParams.get("status") == "returned" && (
          <>
            <div
              className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
              onClick={returnSelected}
            >
              <div className="flex gap-2 cursor-pointer">
                <Image
                  src={"/returned.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <p>Unreturn selected</p>
              </div>
            </div>
            <div
              className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
              onClick={returnAll}
            >
              <div className="flex gap-2 cursor-pointer">
                <Image
                  src={"/returned.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <p>Unreturn all</p>
              </div>
            </div>
          </>
        )}

        <div
          className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
          onClick={(e) => {
            setDeleteConfirm(true);
          }}
        >
          <div className="flex gap-2 cursor-pointer">
            <Image
              src={"/green/trash_green.png"}
              width={20}
              height={20}
              alt=""
            ></Image>
            <p>Delete selected</p>
          </div>
        </div>
        <div
          className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
          onClick={(e) => {
            setDeleteAllConfirm(true);
          }}
        >
          <div className="flex gap-2 cursor-pointer">
            <Image
              src={"/green/trash_green.png"}
              width={20}
              height={20}
              alt=""
            ></Image>
            <p>Delete all</p>
          </div>
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
      {deleteConfirm && (
        <ModalOverlay isDelete={true} onClose={() => setDeleteConfirm(false)}>
          <DeleteConfirmationModal
            cancelClick={setDeleteConfirm}
            deleteClick={deleteSelected}
            isPending={isPending}
            type="Selected Projects"
            message={`Are you sure you want to delete the selected items?`}
          />
        </ModalOverlay>
      )}
      {deleteAllConfirm && (
        <ModalOverlay
          isDelete={true}
          onClose={() => setDeleteAllConfirm(false)}
        >
          <DeleteConfirmationModal
            cancelClick={setDeleteAllConfirm}
            deleteClick={deleteAll}
            isPending={isPending}
            type="All projects"
            message={`Are you sure you want to delete all your items? Note: This action will also delete items associated with any other projects you are a member of.`}
          />
        </ModalOverlay>
      )}
    </div>
  );
};
