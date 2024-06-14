import { Overlay } from "@/components/overlays/Overlay";
import Image from "next/image";

interface CheckedProjects {
  project_id: number;
  checked: boolean;
}

interface CheckedReceipts {
  receipt_id: number;
  checked: boolean;
}

interface SelectedBarProps {
  selectTrigger: boolean;
  checkedItems: CheckedProjects[] | CheckedReceipts[];
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
