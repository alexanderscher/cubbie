import {
  deleteAllReceipts,
  deleteSelectedReceipts,
} from "@/actions/select/selectedReceipts";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import Loading from "@/components/Loading/Loading";
import DeleteConfirmationModal from "@/components/Modals/DeleteConfirmationModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { CheckedReceipts } from "@/types/SelectType";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface SelectedReceiptsOptionsProps {
  checkedReceipts: CheckedReceipts[];
  setCheckedReceipts: (value: any) => void;
  archive?: boolean;
}

export const SelectedReceiptOptions = ({
  checkedReceipts,
  setCheckedReceipts,
}: SelectedReceiptsOptionsProps) => {
  const { reloadReceipts } = useSearchReceiptContext();
  const [isPending, startTransition] = useTransition();
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const deleteSelected = () => {
    startTransition(async () => {
      try {
        const receiptIds = checkedReceipts.map((receipt) => receipt.receipt_id);
        await deleteSelectedReceipts(receiptIds);
        setCheckedReceipts([]);
        reloadReceipts();
        toast.success("Projects deleted successfully");
      } catch (error) {
        toast.error("Error deleting receipts");
      }
    });
  };

  const deleteAll = () => {
    startTransition(async () => {
      try {
        await deleteAllReceipts();
        setCheckedReceipts([]);
        reloadReceipts();
        toast.success("Receipts deleted successfully");
      } catch (error) {
        toast.error("Error deleting receipts");
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
        <div
          className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
          onClick={() => setDeleteConfirm(true)}
        >
          <div className="flex gap-2 cursor-pointer">
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete Selected</p>
          </div>
        </div>
        <div
          className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
          onClick={() => setDeleteAllConfirm(true)}
        >
          <div className="flex gap-2 cursor-pointer">
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete All</p>
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
            message={`Are you sure you want to delete the selected receipts?`}
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
            message={`Are you sure you want to delete all your receipts? Note: This action will also delete receipts associated with any other projects you are a member of.`}
          />
        </ModalOverlay>
      )}
    </div>
  );
};
