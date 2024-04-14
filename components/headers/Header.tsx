"use client";
import SearchBar from "@/components/search/SearchBar";
import React, { useState } from "react";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import { CreateProject } from "@/components/project/CreateProject";
import Image from "next/image";
import Link from "next/link";
import Filters from "@/components/headers/Filters";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className={` flex justify-between `}>
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
            <>
              <Overlay onClose={() => setIsModalVisible(false)} />
              <div
                className="absolute bg-[#97cb97] rounded shadow p-3 -bottom-[120px] z-[200] w-[180px]"
                onClick={(e) => e.preventDefault()}
              >
                {type === "Projects" && (
                  <div className="flex flex-col gap-2 text-sm">
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                      href="/receipts"
                    >
                      <div className="flex items-center gap-3">
                        <div className="pl-1">
                          <Image
                            src="/receipt_b.png"
                            width={13}
                            height={13}
                            alt="folder"
                          ></Image>
                        </div>
                        <p>Receipts</p>
                      </div>
                    </Link>
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                      href="/items"
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <Image
                            src="/item_b.png"
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
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                      href="/"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src="/folder.png"
                          width={20}
                          height={20}
                          alt="folder"
                        ></Image>
                        <p>Projects</p>
                      </div>
                    </Link>
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                      href="/items"
                    >
                      <div className="flex items-center gap-2">
                        <div>
                          <Image
                            src="/item_b.png"
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
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                      href="/"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src="/folder.png"
                          width={20}
                          height={20}
                          alt="folder"
                        ></Image>
                        <p>Projects</p>
                      </div>
                    </Link>
                    <Link
                      className="bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2"
                      href="/receipts"
                    >
                      <div className="flex items-center gap-3">
                        <div className="pl-1">
                          <Image
                            src="/receipt_b.png"
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

        {addProjectOpen && (
          <CreateProject setAddProjectOpen={setAddProjectOpen} />
        )}

        {addReceiptOpen && (
          <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
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
    <div className="fixed z-[500] bottom-8 right-8 shadow-xl w-12 h-12 flex items-center justify-center border-2 border-orange-600 bg-orange-600 text-white rounded-full ">
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
    <div className="absolute -right-1 -bottom-1 w-48 bg-orange-300 shadow-lg rounded-md flex flex-col text-black ">
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
          className="absolute -right-3 -top-3 shadow-xl w-12 h-12 flex items-center justify-center text-xl  bg-white text-orange-600 rounded-full cursor-pointer mb-4"
          onClick={() => setIsModalVisible(false)}
        >
          &times;
        </div>
      </div>
    </div>
  );
};

interface OverlayProps {
  onClose: () => void;
}

const Overlay = ({ onClose }: OverlayProps) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      onClose();
    }
  };
  return (
    <div
      id="modal-overlay"
      className={`filter-overlay`}
      onClick={handleOverlayClick}
    ></div>
  );
};
