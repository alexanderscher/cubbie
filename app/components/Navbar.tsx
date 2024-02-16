"use client";
import LargeButton from "@/app/components/buttons/LargeButton";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [modal, setModal] = useState(false);
  return (
    <div className="flex flex-col gap-4 mb-10">
      <div className="flex justify-between ">
        <div className="flex gap-3">
          <h1 className="text-lg font-bold">
            <Link href="/">STICKY NOTES</Link>
          </h1>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-2 ">
            <a href="/receipt-type">Upload</a>
            <p>Account</p>
            <p onClick={() => setModal(true)}>Search</p>
          </div>
        </div>
      </div>
      {modal && <Modal modal={modal} setModal={() => setModal(false)} />}
    </div>
  );
};

export default Navbar;

interface ModalProps {
  modal: boolean;
  setModal: () => void;
}

const Modal = ({ modal, setModal }: ModalProps) => {
  if (!modal) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-4">
        <div className="flex justify-end">
          <button className="text-white" onClick={setModal}>
            Close
          </button>
        </div>
        <div className="w-full mt-10 flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-white text-sm">
              Search by store, item desceiption, or item barcode
            </p>
            <input
              type="text"
              className="w-full bg-black border-[1.5px] border-white p-2 rounded-md focus:outline-none placeholder:text-white placeholder:text-sm text-white"
            />
          </div>
          <LargeButton
            height={"h-[80px]"}
            text="text-white"
            border="border-white"
            styles={"text-sm"}
          >
            Search by scanning barcode
          </LargeButton>
        </div>
      </div>
    </div>
  );
};
