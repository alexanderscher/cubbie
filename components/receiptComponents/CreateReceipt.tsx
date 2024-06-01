import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import Link from "next/link";

interface AddReceiptModalProps {
  setAddReceiptOpen: (value: boolean) => void;
}

export const CreateReceipt = ({ setAddReceiptOpen }: AddReceiptModalProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center border-b  px-5 py-3 rounded-t-lg border-emerald-900">
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
        <div className="p-4 bg-slate-100   rounded-lg text-sm cursor-pointer hover:bg-slate-200">
          <div className="flex gap-3 justify-center items-center">
            <Link href="/create/image">
              <p className="text-emerald-900">Analyze Receipt Image</p>
            </Link>
            <TooltipWithHelperIcon
              iconColor="text-orange-600"
              content="  Take a photo of your receipt and upload it. We use AI to extract
              and fill in the details of your receipt and item information. This
              process works best with physical receipts or memo receipts."
            />
          </div>
        </div>

        <div className="p-4 bg-slate-100   rounded-lg text-sm  cursor-pointer hover:bg-slate-200">
          <div className="flex gap-3 justify-center items-center">
            <Link href="/create/text">
              <p className="text-emerald-900">Analyze Receipt Text</p>
            </Link>
            <TooltipWithHelperIcon
              iconColor="text-orange-600"
              content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
            />
          </div>
        </div>

        <button className="p-4 bg-slate-100   rounded-lg text-sm  cursor-pointer hover:bg-slate-200">
          <Link href="/create/manual">
            <p className="text-emerald-900">Manually Enter Receipt</p>
          </Link>
        </button>
      </div>
    </div>
  );
};
