"use client";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Receipt from "@/components/receiptComponents/Receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./project.module.css";
import { NoReceipts } from "@/components/receiptComponents/NoReceipts";
import { ProjectOptionsModal } from "@/components/options/ProjectOptions";
import Filters from "@/components/headers/Filters";
import { useSearchParams } from "next/navigation";
import { Overlay } from "@/components/overlays/Overlay";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { TruncateText } from "@/components/text/Truncate";
import { getProjectByIdClient } from "@/lib/getProjectsClient";
import PageLoading from "@/components/Loading/PageLoading";
import { DefaultItem, DefaultReceipt, ProjectIdType } from "@/types/ProjectID";
import { Receipt as ReceiptType } from "@/types/AppTypes";

interface ProjectIdProps {
  sessionUserId: string | undefined;
  projectId: string;
}

const defaultProject: ProjectIdType = {
  id: 0,
  name: "",
  created_at: new Date(),
  userId: "",
  receipts: [],
  asset_amount: 0,
  projectUsers: [],
  projectUserArchive: [],
  user: {
    id: "",
    name: "",
    email: "",
    emailVerified: undefined,
    image: "",
    role: "",
    password: "",
    isTwoFactorEnabled: false,
    phone: "",
  },
};

export const ProjectId = ({ sessionUserId, projectId }: ProjectIdProps) => {
  const [isAddOpen, setAddReceiptOpen] = useState(false);
  const [project, setProject] = useState<ProjectIdType>(defaultProject);

  console.log(project);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReceiptData, setFilteredReceiptData] = useState<
    DefaultReceipt[]
  >([]);
  const [isArchived, setIsArchived] = useState(false);
  const [openReceiptId, setOpenReceiptId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getProjectByIdClient(projectId);
      if (data) {
        setProject(data);
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (project.id) {
      const userId = project.userId;
      const isArchived =
        project.projectUserArchive?.some(
          (entry) => entry.userId === userId?.toString()
        ) || false;
      setIsArchived(isArchived);
    }
  }, [project]);

  const searchParams = useSearchParams();

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
  const getTotalPrice = (items: DefaultItem[]) =>
    items.reduce((acc, item) => acc + item.price, 0);

  const storeType = searchParams.get("storeType") || "all";

  const sortedAndFilteredData = useMemo(() => {
    if (!project.id) return []; // Return an empty array if project is not fetched yet

    const filteredByStoreType =
      storeType === "all"
        ? project.receipts
        : project.receipts.filter(
            (receipt) => receipt.type.toLocaleLowerCase() === storeType
          );
    const compareReceipts = (a: DefaultReceipt, b: DefaultReceipt) => {
      if (sortField === "price") {
        const totalPriceA = getTotalPrice(a.items || []);
        const totalPriceB = getTotalPrice(b.items || []);
        if (sortOrder === "asc") {
          return totalPriceB - totalPriceA;
        } else {
          return totalPriceA - totalPriceB;
        }
      } else {
        const dateA = new Date(
          a[sortField as keyof DefaultReceipt] as Date
        ).getTime();
        const dateB = new Date(
          b[sortField as keyof DefaultReceipt] as Date
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
  };

  useEffect(() => {
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

    if (project.id) {
      filterReceipts(searchTerm);
    }
  }, [project, searchTerm, sortedAndFilteredData]);
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
          <TruncateText
            text={project.name}
            styles={"text-emerald-900 text-sm"}
          />
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
            placeholder={
              !isLoading ? `Search receipts from ${project.name}` : ""
            }
            value={searchTerm}
            onChange={handleChange}
          />
        </div>
        <Filters />
        {isLoading && <PageLoading loading={isLoading} />}
        {!isLoading && (
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
                  {filteredReceiptData.map((receipt: DefaultReceipt) => (
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
                (receipt: DefaultReceipt) => !receipt.expired
              ).length === 0 ? (
                <NoReceipts
                  setAddReceiptOpen={setAddReceiptOpen}
                  addReceiptOpen={isAddOpen}
                />
              ) : (
                <div className="boxes">
                  {filteredReceiptData
                    .filter((receipt: DefaultReceipt) => !receipt.expired)
                    .map((receipt: DefaultReceipt) => (
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
                (receipt: DefaultReceipt) => receipt.expired
              ).length === 0 ? (
                <NoReceipts
                  setAddReceiptOpen={setAddReceiptOpen}
                  addReceiptOpen={isAddOpen}
                />
              ) : (
                <div className="boxes">
                  {filteredReceiptData
                    .filter((receipt: DefaultReceipt) => receipt.expired)
                    .map((receipt: DefaultReceipt) => (
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
        )}
      </div>
    </div>
  );
};

export default ProjectId;
