import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Image from "next/image";

export const NoItems = ({
  setAddReceiptOpen,
  addReceiptOpen,
}: {
  setAddReceiptOpen: (value: boolean) => void;
  addReceiptOpen: boolean;
}) => {
  return (
    <div className="box relative">
      <div className="flex flex-col gap-4 justify-center items-center p-6">
        <Image
          src="/green/item_green.png"
          alt=""
          width={50}
          height={50}
          className="object-cover "
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <p className="text-md text-emerald-900">No items</p>
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
  );
};
