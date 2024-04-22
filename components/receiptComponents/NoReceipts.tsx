import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Image from "next/image";

interface NoReceiptsProps {
  setAddReceiptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addReceiptOpen: boolean;
}

export const NoReceipts = ({
  setAddReceiptOpen,
  addReceiptOpen,
}: NoReceiptsProps) => {
  return (
    <div className="boxes">
      <div className="box relative">
        <div className="flex flex-col gap-4 justify-center items-center  p-6">
          <Image
            src="/receipt_b.png"
            alt=""
            width={25}
            height={25}
            className="object-cover "
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <p className=" text-emerald-900">No receipts </p>
          <button
            className="border-[1px]  border-emerald-900 py-2 px-10 text-xs text-emerald-900 rounded-full w-full"
            onClick={() => setAddReceiptOpen(true)}
          >
            <p className="">Create</p>
          </button>
          {addReceiptOpen && (
            <ModalOverlay onClose={() => setAddReceiptOpen(false)}>
              <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
            </ModalOverlay>
          )}
        </div>
      </div>
    </div>
  );
};
