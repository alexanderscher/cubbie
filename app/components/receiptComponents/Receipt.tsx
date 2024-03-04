"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ReceiptProps {
  receipt: ReceiptType;
}

const Receipt = ({ receipt }: ReceiptProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="box xs:pb-6 pb-4 relative">
      <div className="w-full  overflow-hidden relative flex justify-center items-center bg-slate-100 rounded-t-lg h-[90px]">
        <div className="w-full h-full flex justify-center items-center ">
          <Image
            src="/receipt_b.png"
            alt=""
            width={30}
            height={30}
            className="object-cover "
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <Image
            src="/three-dots.png"
            className="absolute top-0 right-2 cursor-pointer "
            alt=""
            width={20}
            height={20}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>
      {isOpen && <OptionsModal receipt={receipt} />}

      <div className="p-3 flex flex-col justify-between">
        {receipt.project && (
          <p className="text-xs text-emerald-900 mb-1">
            {receipt.project.name}
          </p>
        )}

        <div className="border-b-[1px] border-slate-400 ">
          <Link href={`/receipt/${receipt.id}`} className="">
            <TruncateText
              text={receipt.store}
              maxLength={18}
              styles={"text-orange-600"}
            />
          </Link>
          <p className="text-xs text-slate-400">
            Return by {formatDateToMMDDYY(receipt.return_date)}
          </p>
        </div>

        <div className="flex flex-col  gap-1 text-xs">
          <div className=" flex flex-col  gap-1 text-xs">
            <div className="flex gap-1 text-xs mt-2 ">
              <p className="">
                {receipt.type === "Store" ? "In Store" : "Online"}{" "}
                {receipt.memo ? "Memo" : "Receipt"}
              </p>
            </div>
          </div>
          <div className="flex gap-1  ">
            <p className=" ">
              {receipt.items.length}{" "}
              {receipt.items.length === 1 ? "item" : "items"} |
            </p>
            <p className=" ">
              {formatCurrency(
                receipt.items.reduce((acc: number, curr: Item) => {
                  return acc + curr.price;
                }, 0)
              )}
            </p>
          </div>
          {receipt.expired && <p className="text-orange-600">Expired</p>}
        </div>
      </div>
    </div>
  );
};

export default Receipt;

interface OptionsModalProps {
  receipt: ReceiptType;
}

const OptionsModal = ({ receipt }: OptionsModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="absolute bg-white shadow-1 -right-2 top-6 rounded-md  w-[200px]">
      <div className="p-4 rounded-lg text-sm flex flex-col gap-2">
        <div className="bg-slate-100 rounded-md w-full p-2">
          <Link href={`receipt/${receipt.id}/edit`}>
            <div className="flex gap-2">
              <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
              <p>Edit</p>
            </div>
          </Link>
        </div>

        <div className="bg-slate-100 rounded-md w-full p-2">
          <div className="flex gap-2">
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete</p>
          </div>
        </div>
        <div className="bg-slate-100 rounded-md w-full p-2 hover:cursor-pointer">
          <div className="flex gap-2">
            <Image src={"/move.png"} width={20} height={20} alt=""></Image>
            <button onClick={() => setIsOpen(true)}>Move</button>
          </div>
        </div>
      </div>
      {isOpen && <MoveModal setIsOpen={setIsOpen} />}
    </div>
  );
};

interface AddItemModalProps {
  setIsOpen: (value: boolean) => void;
}

const MoveModal = ({ setIsOpen }: AddItemModalProps) => {
  const [project, setProject] = useState("");
  const [error, setError] = useState("");

  const createProject = async () => {
    const res = await fetch("/api/project", {
      method: "POST",
      body: JSON.stringify({
        name: project,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setError(data);
    console.log(data);
  };

  const handleSubmit = async () => {
    if (project === "") {
      setError("Please enter a project name");
    }
    if (project !== "") {
      // createProject();
      setIsOpen(false);
    }
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      setIsOpen(false);
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[2000]"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full">
        <div className="flex justify-between items-center border-b border-gray-200 px-5 py-4 bg-slate-100 rounded-t-lg">
          <h3 className="text-lg text-emerald-900">Move project</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900 ">Project Folder</p>
              <select className="w-full border-[1px] p-2 rounded-md border-slate-300 focus:border-emerald-900 focus:outline-none">
                <option>Project 1</option>
                <option>Project 2</option>
                <option>Project 3</option>
              </select>
              {error && <p className="text-orange-900 text-xs">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <RegularButton
              type="button"
              styles="bg-emerald-900 text-white border-emerald-900"
              handleClick={handleSubmit}
            >
              <p className="text-xs">Move</p>
            </RegularButton>
          </div>
        </div>
      </div>
    </div>
  );
};
