"use client";
import {
  deleteAllReceipts,
  deleteSelectedReceipts,
} from "@/actions/select/selectedReceipts";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import { SelectedBar } from "@/components/Home/SelectedBar";
import Loading from "@/components/Loading/Loading";
import PageLoading from "@/components/Loading/PageLoading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { NoReceipts } from "@/components/receiptComponents/NoReceipts";
import Receipt from "@/components/receiptComponents/Receipt";
import { ReceiptItemType, ReceiptType } from "@/types/ReceiptTypes";
import { CheckedReceipts } from "@/types/SelectType";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

const Receipts = () => {
  const {
    filteredReceiptData,
    isReceiptLoading,
    fetchReceipts,
    selectReceiptTrigger,
  } = useSearchReceiptContext();
  const searchParams = useSearchParams();
  const [openReceiptId, setOpenReceiptId] = useState(null as number | null);
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);
  const [checkedReceipts, setCheckedReceipts] = useState<CheckedReceipts[]>([]);
  const [isSelectedOpen, setIsSelectedOpen] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const toggleOpenReceipt = (
    receiptId: number | undefined,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    if (receiptId === undefined) return;

    if (openReceiptId === receiptId) {
      setOpenReceiptId(null);
    } else {
      setOpenReceiptId(receiptId);
    }
  };

  const sortFieldParam = searchParams.get("sort");
  const sortField = sortFieldParam?.startsWith("-")
    ? sortFieldParam.slice(1)
    : sortFieldParam;
  const sortOrder = sortFieldParam?.startsWith("-") ? "desc" : "asc";
  const getTotalPrice = (items: ReceiptItemType[]) =>
    items.reduce((acc, item) => acc + item.price, 0);

  const storeType = searchParams.get("storeType") || "all";

  const sortedAndFilteredData = useMemo(() => {
    const filteredByStoreType =
      storeType === "all"
        ? filteredReceiptData
        : filteredReceiptData.filter(
            (receipt) => receipt.type.toLocaleLowerCase() === storeType
          );
    const compareReceipts = (a: ReceiptType, b: ReceiptType) => {
      if (sortField === "price") {
        const totalPriceA = getTotalPrice(a.items as ReceiptItemType[]);
        const totalPriceB = getTotalPrice(b.items as ReceiptItemType[]);
        if (sortOrder === "asc") {
          return totalPriceB - totalPriceA;
        } else {
          return totalPriceA - totalPriceB;
        }
      } else {
        const dateA = new Date(
          a[sortField as keyof ReceiptType] as Date
        ).getTime();
        const dateB = new Date(
          b[sortField as keyof ReceiptType] as Date
        ).getTime();
        if (sortOrder === "asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      }
    };
    return filteredByStoreType.sort(compareReceipts);
  }, [filteredReceiptData, storeType, sortField, sortOrder]);

  if (isReceiptLoading) {
    return <PageLoading loading={isReceiptLoading} />;
  }

  if (searchParams.get("expired") === "false") {
    const activeReceipts = sortedAndFilteredData.filter(
      (receipt) => !receipt.expired
    );
    if (activeReceipts.length === 0) {
      return (
        <NoReceipts
          setAddReceiptOpen={setAddReceiptOpen}
          addReceiptOpen={addReceiptOpen}
        />
      );
    } else {
      return (
        <div className="flex flex-col gap-6">
          <SelectedBar
            selectTrigger={selectReceiptTrigger}
            checkedItems={checkedReceipts}
            setIsSelectedOpen={setIsSelectedOpen}
            isSelectedOpen={isSelectedOpen}
          >
            <SelectedReceiptOptions
              checkedReceipts={checkedReceipts}
              setCheckedReceipts={setCheckedReceipts}
            />
          </SelectedBar>
          <div className="boxes">
            {activeReceipts.map((receipt) => (
              <Receipt
                key={receipt.id}
                receipt={receipt}
                onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                isOpen={openReceiptId === receipt.id}
                setOpenReceiptId={setOpenReceiptId}
                setCheckedReceipts={setCheckedReceipts}
                checkedReceipts={checkedReceipts}
              />
            ))}
          </div>
        </div>
      );
    }
  } else if (searchParams.get("expired") === "true") {
    const expiredReceipts = sortedAndFilteredData.filter(
      (receipt) => receipt.expired
    );
    if (expiredReceipts.length === 0) {
      return (
        <NoReceipts
          setAddReceiptOpen={setAddReceiptOpen}
          addReceiptOpen={addReceiptOpen}
        />
      );
    } else {
      return (
        <div className="flex flex-col gap-6">
          <SelectedBar
            selectTrigger={selectReceiptTrigger}
            checkedItems={checkedReceipts}
            setIsSelectedOpen={setIsSelectedOpen}
            isSelectedOpen={isSelectedOpen}
          >
            <SelectedReceiptOptions
              checkedReceipts={checkedReceipts}
              setCheckedReceipts={setCheckedReceipts}
            />
          </SelectedBar>
          <div className="boxes">
            {expiredReceipts.map((receipt) => (
              <Receipt
                key={receipt.id}
                receipt={receipt}
                onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                isOpen={openReceiptId === receipt.id}
                setOpenReceiptId={setOpenReceiptId}
                setCheckedReceipts={setCheckedReceipts}
                checkedReceipts={checkedReceipts}
              />
            ))}
          </div>
        </div>
      );
    }
  } else {
    if (sortedAndFilteredData.length === 0 && !isReceiptLoading) {
      return (
        <NoReceipts
          setAddReceiptOpen={setAddReceiptOpen}
          addReceiptOpen={addReceiptOpen}
        />
      );
    } else {
      return (
        <div className="flex flex-col gap-6">
          <SelectedBar
            selectTrigger={selectReceiptTrigger}
            checkedItems={checkedReceipts}
            setIsSelectedOpen={setIsSelectedOpen}
            isSelectedOpen={isSelectedOpen}
          >
            <SelectedReceiptOptions
              checkedReceipts={checkedReceipts}
              setCheckedReceipts={setCheckedReceipts}
            />
          </SelectedBar>
          <div className="boxes">
            {sortedAndFilteredData.map((receipt) => (
              <Receipt
                key={receipt.id}
                receipt={receipt}
                onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                isOpen={openReceiptId === receipt.id}
                setOpenReceiptId={setOpenReceiptId}
                setCheckedReceipts={setCheckedReceipts}
                checkedReceipts={checkedReceipts}
              />
            ))}
          </div>
        </div>
      );
    }
  }
};

export default Receipts;

interface SelectedReceiptsOptionsProps {
  checkedReceipts: CheckedReceipts[];
  setCheckedReceipts: (value: any) => void;
  archive?: boolean;
}

const SelectedReceiptOptions = ({
  checkedReceipts,
  setCheckedReceipts,
}: SelectedReceiptsOptionsProps) => {
  const { reloadReceipts } = useSearchReceiptContext();
  const [isPending, startTransition] = useTransition();
  const [deleteAllConfirm, setDeleteAllConfirm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  console.log(deleteAllConfirm);
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
