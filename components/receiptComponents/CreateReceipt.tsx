"use client";
import { DiscardModal } from "@/components/modals/DiscardModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { set } from "zod";

interface AddReceiptModalProps {
  setAddReceiptOpen: (value: boolean) => void;
}

export const CreateReceipt = ({ setAddReceiptOpen }: AddReceiptModalProps) => {
  const [discardModal, setDiscardModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const pushToPath = () => {
    if (selectedPage === pathname) {
      window.location.reload();
    } else {
      router.push(selectedPage);
    }
  };

  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
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
        <>
          {pathname.startsWith("/create") && (
            <div
              className="p-4 bg-slate-100   rounded-lg text-sm  cursor-pointer hover:bg-slate-200"
              onClick={() => {
                setSelectedPage("/create/image");
                setDiscardModal(true);
              }}
            >
              <div className="flex gap-3 justify-center items-center">
                <p className="text-emerald-900">Analyze Receipt Image</p>
                <TooltipWithHelperIcon
                  iconColor="text-orange-600"
                  content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
                />
              </div>
            </div>
          )}
          {!pathname.startsWith("/create") && (
            <Link href="/create/image">
              <div className="p-4 bg-slate-100   rounded-lg text-sm  cursor-pointer hover:bg-slate-200">
                <div className="flex gap-3 justify-center items-center">
                  <p className="text-emerald-900">Analyze Receipt Image</p>
                  <TooltipWithHelperIcon
                    iconColor="text-orange-600"
                    content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
                  />
                </div>
              </div>
            </Link>
          )}
        </>
        <>
          {pathname.startsWith("/create") && (
            <div
              className="p-4 bg-slate-100   rounded-lg text-sm  cursor-pointer hover:bg-slate-200"
              onClick={() => {
                setSelectedPage("/create/text");
                setDiscardModal(true);
              }}
            >
              <div className="flex gap-3 justify-center items-center">
                <p className="text-emerald-900">Analyze Receipt Text</p>
                <TooltipWithHelperIcon
                  iconColor="text-orange-600"
                  content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
                />
              </div>
            </div>
          )}
          {!pathname.startsWith("/create") && (
            <Link href="/create/text">
              <div className="p-4 bg-slate-100   rounded-lg text-sm  cursor-pointer hover:bg-slate-200">
                <div className="flex gap-3 justify-center items-center">
                  <p className="text-emerald-900">Analyze Receipt Text</p>
                  <TooltipWithHelperIcon
                    iconColor="text-orange-600"
                    content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
                  />
                </div>
              </div>
            </Link>
          )}
        </>

        <>
          {pathname.startsWith("/create") && (
            <div
              className="p-4 bg-slate-100   rounded-lg text-sm  cursor-pointer hover:bg-slate-200"
              onClick={() => {
                setSelectedPage("/create/manual");
                setDiscardModal(true);
              }}
            >
              <div className="flex gap-3 justify-center items-center">
                <p className="text-emerald-900">Manually Enter</p>
                <TooltipWithHelperIcon
                  iconColor="text-orange-600"
                  content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
                />
              </div>
            </div>
          )}
          {!pathname.startsWith("/create") && (
            <Link href="/create/manual">
              <div className="p-4 bg-slate-100   rounded-lg text-sm  cursor-pointer hover:bg-slate-200">
                <div className="flex gap-3 justify-center items-center">
                  <p className="text-emerald-900">Manually Enter</p>
                  <TooltipWithHelperIcon
                    iconColor="text-orange-600"
                    content="Enter your receipt details first, then copy and paste the item
              information from your online receipt email. We use AI to
              accurately populate the item details."
                  />
                </div>
              </div>
            </Link>
          )}
        </>
      </div>
      {discardModal && (
        <ModalOverlay onClose={() => setDiscardModal(false)}>
          <DiscardModal
            setDiscardModal={setDiscardModal}
            leavePage={pushToPath}
          />
        </ModalOverlay>
      )}
    </div>
  );
};
