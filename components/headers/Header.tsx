"use client";
import RegularButton from "@/components/buttons/RegularButton";
import SearchBar from "@/components/search/SearchBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import styles from "./Header.module.css";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import { CreateProject } from "@/components/project/CreateProject";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import Image from "next/image";
import Link from "next/link";
import Filters from "@/components/headers/Filters";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);
  const { filteredReceiptData } = useSearchReceiptContext();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleExpiredlick = (name: string) => {
    router.push(pathname + "?" + createQueryString("expired", name));
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <div className="flex flex-col gap-6 pb-4 ">
      <div className={` flex justify-between pb-2`}>
        <div className="cursor-pointer relative">
          <div onClick={() => setIsModalVisible(!isModalVisible)}>
            <div className="flex gap-2 items-center ">
              <h1 className="text-2xl text-emerald-900">{type}</h1>
              <Image
                src="/arrow_grey.png"
                width={8}
                height={8}
                alt="arrow"
                className="rotate-90"
              />
            </div>
          </div>

          {isModalVisible && (
            <div className="absolute bg-[#97cb97] rounded shadow p-3 -bottom-[120px] z-[200] w-[160px]">
              {type === "Projects" && (
                <div className="flex flex-col gap-2 text-sm">
                  <Link
                    className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                    href="/receipts"
                  >
                    Receipts
                  </Link>
                  <Link
                    className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                    href="/items"
                  >
                    Items
                  </Link>
                </div>
              )}
              {type === "Receipts" && (
                <div className="flex flex-col gap-2 text-sm">
                  <Link
                    className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                    href="/"
                  >
                    Projects
                  </Link>
                  <Link
                    className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                    href="/items"
                  >
                    Items
                  </Link>
                </div>
              )}
              {type === "Items" && (
                <div className="flex flex-col gap-2 text-sm">
                  <Link
                    className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                    href="/"
                  >
                    Projects
                  </Link>
                  <Link
                    className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                    href="/receipts"
                  >
                    Receipts
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        <Filters />

        {addProjectOpen && (
          <CreateProject setAddProjectOpen={setAddProjectOpen} />
        )}

        {addReceiptOpen && (
          <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
        )}
      </div>

      <div className=" flex justify-between items-center relative flex-wrap gap-4 ">
        <SearchBar searchType={type} />
        {pathname === "/receipts" && filteredReceiptData.length > 0 && (
          <div className="flex w-full    ">
            <button
              className={`${
                searchParams.get("expired") === "false" ||
                !searchParams.get("expired")
                  ? "p-2  underline text-emerald-900"
                  : "p-2  rounded-full"
              }`}
              onClick={() => {
                handleExpiredlick("false");
              }}
            >
              <p className="text-sm text-emerald-900">Active Receipts</p>
            </button>
            <button
              className={`${
                searchParams.get("expired") === "true"
                  ? "p-2 underline text-emerald-900"
                  : "p-2  rounded-full"
              }`}
              onClick={() => {
                handleExpiredlick("true");
              }}
            >
              <p className="text-sm text-emerald-900">Expired Receipts</p>
            </button>
          </div>
        )}
      </div>
      <AddButton
        setAddReceiptOpen={setAddReceiptOpen}
        setAddProjectOpen={setAddProjectOpen}
      />
    </div>
  );
};

export default Header;

interface AddButtonProps {
  setAddReceiptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAddProjectOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddButton = ({
  setAddReceiptOpen,
  setAddProjectOpen,
}: AddButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <div className="fixed z-10 bottom-8 right-8 shadow-xl w-12 h-12 flex items-center justify-center border-2 border-orange-600 bg-orange-600 text-white rounded-full ">
      <div className="relative">
        <button onClick={() => setIsModalVisible(!isModalVisible)} className="">
          <p className="text-xl">+</p>
        </button>
      </div>
      {isModalVisible && (
        <OptionsModal
          setAddProjectOpen={setAddProjectOpen}
          setAddReceiptOpen={setAddReceiptOpen}
          setIsModalVisible={setIsModalVisible}
        />
      )}
    </div>
  );
};

const OptionsModal = ({
  setAddReceiptOpen,
  setAddProjectOpen,
  setIsModalVisible,
}: AddButtonProps & {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="absolute -right-1 -bottom-1 w-48 bg-orange-300 shadow-lg rounded-md flex flex-col text-black z-200">
      <div className="flex flex-col text-start gap-3 relative p-4">
        <div
          className="bg-orange-100 hover:bg-orange-200 rounded-md p-3 cursor-pointer"
          onClick={() => setAddProjectOpen(true)}
        >
          <button className="text-sm text-orange-600">Create Project</button>
        </div>
        <div
          className="bg-orange-100 hover:bg-orange-200 rounded-md p-3 cursor-pointer"
          onClick={() => setAddReceiptOpen(true)}
        >
          <button className="text-sm text-orange-600">Create Receipt</button>
        </div>
        <div
          className="absolute -right-3 -top-3 shadow-xl w-12 h-12 flex items-center justify-center  bg-white text-orange-600 rounded-full cursor-pointer"
          onClick={() => setIsModalVisible(false)}
        >
          X
        </div>
      </div>
    </div>
  );
};
