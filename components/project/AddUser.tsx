import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import Link from "next/link";

interface AddReceiptModalProps {
  setAddReceiptOpen: (value: boolean) => void;
}

export const AddUser = ({ setAddReceiptOpen }: AddReceiptModalProps) => {
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
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[2000] "
      onClick={(e) => {
        handleOverlayClick;
        e.preventDefault();
      }}
    >
      <div className="bg-white rounded-md shadow-xl m-4 max-w-md w-full rounded-t-md">
        <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3 ">
          <h3 className=" text-emerald-900">Create Receipt Options</h3>
          <button
            type="button"
            className="text-emerald-900 "
            onClick={() => setAddReceiptOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="flex flex-col p-6 gap-3">
          <div className="p-4 bg-slate-100   rounded-md text-sm cursor-pointer hover:bg-slate-200">
            <div className="flex gap-3 justify-center items-center">
              <Link href="/create/image">
                <p className="text-emerald-900">Analyze Receipt Image</p>
              </Link>
              <TooltipWithHelperIcon
                iconColor="text-emerald-900"
                content="  Take a photo of your receipt and upload it. We use AI to extract
              and fill in the details of your receipt and item information. This
              process works best with physical receipts or memo receipts."
              />
            </div>
          </div>

          <div className="p-4 bg-slate-100   rounded-md text-sm  cursor-pointer hover:bg-slate-200">
            <div className="flex gap-3 justify-center items-center">
              <Link href="/create/text">
                <p className="text-emerald-900">Analyze Receipt Text</p>
              </Link>
              <TooltipWithHelperIcon
                iconColor="text-emerald-900"
                content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
              />
            </div>
          </div>

          <button className="p-4 bg-slate-100   rounded-md text-sm  cursor-pointer hover:bg-slate-200">
            <Link href="/create/manual">
              <p className="text-emerald-900">Manually Enter Receipt</p>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};
