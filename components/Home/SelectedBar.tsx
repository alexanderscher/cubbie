import { Overlay } from "@/components/overlays/Overlay";
import {
  CheckedItems,
  CheckedProjects,
  CheckedReceipts,
} from "@/types/SelectType";
import Image from "next/image";

interface SelectedBarProps {
  selectTrigger: boolean;
  checkedItems: CheckedProjects[] | CheckedReceipts[] | CheckedItems[];
  setIsSelectedOpen: (value: boolean) => void;
  isSelectedOpen: boolean;
  children: React.ReactNode;
}

export const SelectedBar = ({
  selectTrigger,
  checkedItems,
  setIsSelectedOpen,
  isSelectedOpen,
  children,
}: SelectedBarProps) => {
  return (
    <>
      {selectTrigger && (
        <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center shadow relative">
          <p className="text-sm">{checkedItems.length} selected</p>

          <div
            className="cursor-pointer"
            onClick={() => setIsSelectedOpen(!isSelectedOpen)}
          >
            <Image src="/three-dots.png" alt="" width={20} height={20} />
          </div>
          {isSelectedOpen && (
            <>
              <Overlay onClose={() => setIsSelectedOpen(false)} />
              {children}
            </>
          )}
        </div>
      )}
    </>
  );
};
