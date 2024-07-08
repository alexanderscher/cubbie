"use client";
import SearchBar from "@/components/search/SearchBar";
import React, { useState } from "react";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import { CreateProject } from "@/components/project/CreateProject";
import Image from "next/image";
import Link from "next/link";
import Filters from "@/components/headers/Filters";
import { Overlay } from "@/components/overlays/Overlay";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import RegularButton from "@/components/buttons/RegularButton";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import { useSearchItemContext } from "@/components/context/SearchItemContext";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { fetchProjects } = useSearchProjectContext();
  const { fetchReceipts } = useSearchReceiptContext();
  const { fetchItems } = useSearchItemContext();
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className={` flex justify-between `}>
        <div className="cursor-pointer relative w-full">
          <div onClick={() => setIsModalVisible(!isModalVisible)}>
            <div className="flex gap-4 items-center justify-between w-full ">
              <div className=" flex gap-2 items-center">
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
          </div>

          {isModalVisible && (
            <>
              <Overlay onClose={() => setIsModalVisible(false)} />
              <div
                className="absolute bg-[#97cb97] rounded-lg shadow p-3 -bottom-[120px] z-[2000] w-[180px]"
                onClick={(e) => e.preventDefault()}
              >
                {type === "Projects" && (
                  <div className="flex flex-col gap-2 text-sm">
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded-lg p-2"
                      href="/receipts"
                    >
                      <div className="flex items-center gap-3">
                        <div className="pl-1">
                          <Image
                            src="/green/receipt_green.png"
                            width={13}
                            height={13}
                            alt="folder"
                          ></Image>
                        </div>
                        <p>Receipts</p>
                      </div>
                    </Link>
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded-lg p-2"
                      href="/items"
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <Image
                            src="/green/item_green.png"
                            width={20}
                            height={20}
                            alt="folder"
                          ></Image>
                        </div>

                        <p>Items</p>
                      </div>
                    </Link>
                  </div>
                )}
                {type === "Receipts" && (
                  <div className="flex flex-col gap-2 text-sm">
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded-lg p-2"
                      href="/"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src="/green/folder_green.png"
                          width={20}
                          height={20}
                          alt="folder"
                        ></Image>
                        <p>Projects</p>
                      </div>
                    </Link>
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded-lg p-2"
                      href="/items"
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <Image
                            src="/green/item_green.png"
                            width={20}
                            height={20}
                            alt="folder"
                          ></Image>
                        </div>

                        <p>Items</p>
                      </div>
                    </Link>
                  </div>
                )}
                {type === "Items" && (
                  <div className="flex flex-col gap-2 text-sm">
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded-lg p-2"
                      href="/"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src="/green/folder_green.png"
                          width={20}
                          height={20}
                          alt="folder"
                        ></Image>
                        <p>Projects</p>
                      </div>
                    </Link>
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded-lg p-2"
                      href="/receipts"
                    >
                      <div className="flex items-center gap-3">
                        <div className="pl-1">
                          <Image
                            src="/green/receipt_green.png"
                            width={13}
                            height={13}
                            alt="folder"
                          ></Image>
                        </div>
                        <p>Receipts</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div
          className="text-sm border-[1px] border-emerald-900 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer bg p-1"
          onClick={() => {
            switch (type) {
              case "Projects":
                fetchProjects();
                break;
              case "Receipts":
                fetchReceipts();
                break;
              case "Items":
                fetchItems();
              default:
                break;
            }
          }}
        >
          <Image
            src="/green/refresh_green.png"
            width={20}
            height={20}
            alt="refresh"
          ></Image>
        </div>

        {addProjectOpen && (
          <ModalOverlay onClose={() => setAddProjectOpen(false)}>
            <CreateProject setAddProjectOpen={setAddProjectOpen} />
          </ModalOverlay>
        )}

        {addReceiptOpen && (
          <ModalOverlay onClose={() => setAddReceiptOpen(false)}>
            <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
          </ModalOverlay>
        )}
      </div>

      <div className=" flex justify-between items-center relative flex-wrap gap-4 ">
        <SearchBar searchType={type} />
      </div>
      <Filters />

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
    <div
      className="fixed  bottom-8 right-8 shadow-xl w-12 h-12 flex items-center justify-center border-2 border-orange-600 bg-orange-600 text-white rounded-full cursor-pointer z-[100]"
      onClick={() => setIsModalVisible(!isModalVisible)}
    >
      <p className="text-xl">+</p>

      {isModalVisible && (
        <>
          <OptionsModal
            setAddProjectOpen={setAddProjectOpen}
            setAddReceiptOpen={setAddReceiptOpen}
            setIsModalVisible={setIsModalVisible}
          />
          <Overlay onClose={() => setIsModalVisible(false)} />
        </>
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
    <div className="absolute -right-1 -bottom-1 w-48 bg-orange-300 shadow-lg rounded-lg flex flex-col text-black z-[2000]">
      <div className="flex flex-col text-start gap-3 relative p-4">
        <div
          className="bg-orange-100 hover:bg-orange-200 rounded-lg p-3 cursor-pointer"
          onClick={() => setAddProjectOpen(true)}
        >
          <button className="text-sm text-orange-600">Create Project</button>
        </div>
        <div
          className="bg-orange-100 hover:bg-orange-200 rounded-lg p-3 cursor-pointer"
          onClick={() => setAddReceiptOpen(true)}
        >
          <button className="text-sm text-orange-600">Create Receipt</button>
        </div>
        <div
          className="absolute -right-3 -top-3 shadow-xl w-12 h-12 flex items-center justify-center text-xl  bg-white text-orange-600 rounded-full cursor-pointer mb-4"
          onClick={() => setIsModalVisible(false)}
        >
          &times;
        </div>
      </div>
    </div>
  );
};
