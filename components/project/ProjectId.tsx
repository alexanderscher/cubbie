"use client";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Receipt from "@/components/receiptComponents/Receipt";
import {
  Item,
  Project as ProjectType,
  Receipt as ReceiptType,
} from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import styles from "./project.module.css";
import { NoReceipts } from "@/components/receiptComponents/NoReceipts";
import { ProjectOptionsModal } from "@/components/options/ProjectOptions";

import Filters from "@/components/headers/Filters";
import { useSearchParams } from "next/navigation";
import { Overlay } from "@/components/overlays/Overlay";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import RegularButton from "@/components/buttons/RegularButton";
import { formatCurrency } from "@/utils/formatCurrency";
import { TruncateText } from "@/components/text/Truncate";
interface ProjectIdProps {
  project: ProjectType;
  sessionUserId: string | undefined;
}

export const ProjectId = ({ project, sessionUserId }: ProjectIdProps) => {
  const [isAddOpen, setAddReceiptOpen] = useState(false);
  // const [isDetailsOpen, setDetailsOpen] = useState(false);

  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = project.userId;
  const [filteredReceiptData, setFilteredReceiptData] = useState(
    project.receipts
  );

  const [openReceiptId, setOpenReceiptId] = useState(null as number | null);

  const isArchived =
    project.projectUserArchive?.some(
      (entry) => entry.userId === userId?.toString()
    ) || false;

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
  const getTotalPrice = (items: Item[]) =>
    items.reduce((acc, item) => acc + item.price, 0);

  const storeType = searchParams.get("storeType") || "all";

  const sortedAndFilteredData = useMemo(() => {
    const filteredByStoreType =
      storeType === "all"
        ? project.receipts
        : project.receipts.filter(
            (receipt) => receipt.type.toLocaleLowerCase() === storeType
          );
    const compareReceipts = (a: ReceiptType, b: ReceiptType) => {
      if (sortField === "price") {
        const totalPriceA = getTotalPrice(a.items);
        const totalPriceB = getTotalPrice(b.items);
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
  }, [project, storeType, sortField, sortOrder]);

  const filterReceipts = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredReceiptData(sortedAndFilteredData);
    } else {
      const filtered = sortedAndFilteredData.filter((receipt) =>
        receipt.store.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredReceiptData(filtered);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    filterReceipts(newSearchTerm);
  };

  return (
    <div className="flex flex-col  w-full h-full max-w-[1090px]">
      <div className="flex justify-between items-center gap-4 border-b-[1px] border-emerald-900 pb-4">
        <div className="flex gap-4">
          <Link href="/">
            <p className="text-emerald-900 hover:text-orange-600 text-sm">
              All Projects
            </p>
          </Link>
          <p className="text-emerald-900 text-sm">/</p>
          <p className="text-emerald-900 text-sm">{project.name}</p>
        </div>
      </div>
      <div className="flex flex-col gap-8 mt-10 bg">
        <div className={`${styles.header} `}>
          <div className="flex flex-col justify-between gap-4 w-full">
            <div className="flex justify-between w-full items-start">
              <div>
                <TruncateText
                  text={project.name}
                  styles={"text-2xl text-orange-600 "}
                />
                <p className="text-sm">
                  Created on {formatDateToMMDDYY(project.created_at)}
                </p>
              </div>
              <div className="flex gap-2">
                {/* <RegularButton
                  styles="border-emerald-900 text-white bg-emerald-900 text-xs"
                  handleClick={() => {
                    setDetailsOpen(true);
                  }}
                >
                  <p>Project details</p>
                </RegularButton> */}
                <div
                  className={`relative hover:border-[1px] hover:border-emerald-900 px-4 py-1 rounded-full cursor-pointer flex items-center ${
                    isOpen &&
                    "border-[1px] border-emerald-900 px-4 py-1 rounded-full"
                  }`}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <Image src="/three-dots.png" alt="" width={20} height={20} />
                  {isOpen && (
                    <>
                      <Overlay onClose={() => setIsOpen(false)} />
                      <ProjectOptionsModal
                        archived={isArchived}
                        isOpen={isOpen}
                        project={project}
                        sessionUserId={sessionUserId}
                      />
                    </>
                  )}
                </div>
                {/* {isDetailsOpen && (
                  <ModalOverlay onClose={() => setDetailsOpen(false)}>
                    <ProjectDetails
                      project={project}
                      setDetailsOpen={setDetailsOpen}
                    />
                  </ModalOverlay>
                )} */}
              </div>
            </div>
          </div>

          {isAddOpen && (
            <ModalOverlay onClose={() => setAddReceiptOpen(false)}>
              <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
            </ModalOverlay>
          )}
        </div>
        <div className="w-full">
          <input
            className="searchBar border-[1px] border-emerald-900 placeholder:text-emerald-900 placeholder:text-xs flex items-center text-sm text-emerald-900 p-3"
            placeholder={`Search receipts from ${project.name}`}
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
        <Filters />

        <>
          {searchParams.get("expired") === "all" ||
          !searchParams.get("expired") ? (
            filteredReceiptData.length === 0 ? (
              <NoReceipts
                setAddReceiptOpen={setAddReceiptOpen}
                addReceiptOpen={isAddOpen}
              />
            ) : (
              <div className="boxes">
                {filteredReceiptData.map((receipt: ReceiptType) => (
                  <Receipt
                    key={receipt.id}
                    receipt={receipt}
                    onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                    isOpen={openReceiptId === receipt.id}
                    setOpenReceiptId={setOpenReceiptId}
                  />
                ))}
              </div>
            )
          ) : null}

          {searchParams.get("expired") === "false" ? (
            filteredReceiptData.filter(
              (receipt: ReceiptType) => !receipt.expired
            ).length === 0 ? (
              <NoReceipts
                setAddReceiptOpen={setAddReceiptOpen}
                addReceiptOpen={isAddOpen}
              />
            ) : (
              <div className="boxes">
                {filteredReceiptData
                  .filter((receipt: ReceiptType) => !receipt.expired)
                  .map((receipt: ReceiptType) => (
                    <Receipt
                      key={receipt.id}
                      receipt={receipt}
                      onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                      isOpen={openReceiptId === receipt.id}
                      setOpenReceiptId={setOpenReceiptId}
                    />
                  ))}
              </div>
            )
          ) : null}

          {searchParams.get("expired") === "true" ? (
            filteredReceiptData.filter(
              (receipt: ReceiptType) => receipt.expired
            ).length === 0 ? (
              <NoReceipts
                setAddReceiptOpen={setAddReceiptOpen}
                addReceiptOpen={isAddOpen}
              />
            ) : (
              <div className="boxes">
                {filteredReceiptData
                  .filter((receipt: ReceiptType) => receipt.expired)
                  .map((receipt: ReceiptType) => (
                    <Receipt
                      key={receipt.id}
                      receipt={receipt}
                      onToggleOpen={(e) => toggleOpenReceipt(receipt.id, e)}
                      isOpen={openReceiptId === receipt.id}
                      setOpenReceiptId={setOpenReceiptId}
                    />
                  ))}
              </div>
            )
          ) : null}
        </>
      </div>
    </div>
  );
};

export default ProjectId;

// const ProjectDetails = ({
//   project,
//   setDetailsOpen,
// }: {
//   project: ProjectType;
//   setDetailsOpen: (value: boolean) => void;
// }) => {
//   const totalAmount = project.receipts.reduce(
//     (totalAcc: number, receipt: ReceiptType) => {
//       const receiptTotal = receipt.items.reduce(
//         (itemAcc: number, item: Item) => {
//           return itemAcc + item.price;
//         },
//         0
//       );

//       return totalAcc + receiptTotal;
//     },
//     0
//   );

//   return (
//     <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full">
//       <div className="flex justify-between items-center border-b  px-5 py-3 rounded-t-lg border-emerald-900">
//         <h3 className=" text-emerald-900">Project Details</h3>
//         <button
//           type="button"
//           className="text-emerald-900 "
//           onClick={() => setDetailsOpen(false)}
//         >
//           <span className="text-2xl">&times;</span>
//         </button>
//       </div>
//       <div className="">
//         <div className="p-4 ">
//           <p className="text-slate-400 text-xs">Number of receipts</p>
//           <p className="text-sm">{project.receipts.length}</p>
//         </div>

//         <div className="p-4 border-t-[1px] ">
//           <p className="text-slate-400 text-xs ">Project total amount</p>
//           <p className="text-sm">{formatCurrency(totalAmount)}</p>
//         </div>
//       </div>
//     </div>
//   );
// };
