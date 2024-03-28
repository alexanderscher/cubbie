import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import Link from "next/link";

interface AddReceiptModalProps {
  setAddReceiptOpen: (value: boolean) => void;
}

export const CreateReceipt = ({ setAddReceiptOpen }: AddReceiptModalProps) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      setAddReceiptOpen(false);
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[2000] "
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-md shadow-xl m-4 max-w-md w-full rounded-t-lg">
        <div className="flex justify-between items-center border-b border-gray-200 px-5 py-2 bg-emerald-900 rounded-t-lg">
          <h3 className=" text-white">Create Receipt Options</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setAddReceiptOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="flex flex-col ">
          <div className="border-b-[1px] p-4 rounded-md text-sm cursor-pointer hover:bg-slate-100 ">
            <div className="flex gap-3 justify-center items-center">
              <Link href="/create/image">
                <p className="">Analyze Receipt Image</p>
              </Link>
              <TooltipWithHelperIcon
                content="  Take a photo of your receipt and upload it. We use AI to extract
              and fill in the details of your receipt and item information. This
              process works best with physical receipts or memo receipts."
              />
            </div>
          </div>

          <div className="border-b-[1px] p-4 rounded-md text-sm  cursor-pointer hover:bg-slate-100 ">
            <div className="flex gap-3 justify-center items-center">
              <Link href="/create/text">
                <p className="">Analyze Receipt Text</p>
              </Link>
              <TooltipWithHelperIcon
                content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
              />
            </div>
          </div>

          <button className="border-b-[1px] p-4 rounded-md text-sm  cursor-pointer hover:bg-slate-100 ">
            <Link href="/create/manual">
              <p className="">Manually Enter Receipt</p>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};
