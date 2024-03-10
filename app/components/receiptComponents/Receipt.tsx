"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { useSearchContext } from "@/app/components/context/SearchContext";
import { AddItem } from "@/app/components/item/AddItem";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item, Project, Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

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
        {/* {receipt.project && (
          <p className="text-xs text-emerald-900 mb-1">
            {receipt.project.name}
          </p>
        )} */}

        <div className=" ">
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
          {/* <div className=" flex flex-col  gap-1 text-xs">
            <div className="flex gap-1 text-xs mt-2 ">
              <p className="">
                {receipt.type === "Store" ? "In Store" : "Online"}{" "}
                {receipt.memo ? "Memo" : "Receipt"}
              </p>
            </div>
          </div> */}
          <div className="flex gap-1  mt-2">
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
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { setIsReceiptRefreshed } = useSearchContext();
  return (
    <div className="absolute bg-white shadow-1 -right-2 top-6 rounded-md  w-[200px]">
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div
          className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2 cursor-pointer"
          onClick={() => {
            setIsAddOpen(true);
          }}
        >
          <div className="flex gap-2">
            <Image src={"/add.png"} width={20} height={20} alt=""></Image>
            <p>Add item</p>
          </div>
        </div>
        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2 hover:cursor-pointer">
          <div className="flex gap-2" onClick={() => setIsOpen(true)}>
            <Image src={"/move.png"} width={20} height={20} alt=""></Image>
            <p>Move</p>
          </div>
        </div>
        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2">
          <Link href={`/receipt/${receipt.id}/edit`}>
            <div className="flex gap-2">
              <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
              <p>Edit</p>
            </div>
          </Link>
        </div>

        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => {
              setIsDeleteOpen(true);
            }}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete</p>
          </div>
        </div>
      </div>
      {isOpen && <MoveModal setIsOpen={setIsOpen} receipt={receipt} />}
      {isAddOpen && (
        <AddItem
          setIsAddOpen={setIsAddOpen}
          id={receipt.id}
          setRefresh={setIsReceiptRefreshed}
        />
      )}
      {isDeleteOpen && (
        <DeleteModal setDeleteOpen={setIsDeleteOpen} receipt={receipt} />
      )}
    </div>
  );
};

interface AddItemModalProps {
  setIsOpen: (value: boolean) => void;
  receipt: ReceiptType;
}

const MoveModal = ({ setIsOpen, receipt }: AddItemModalProps) => {
  const [project, setProject] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const { setIsReceiptRefreshed } = useSearchContext();

  useEffect(() => {
    const getProjects = async () => {
      setLoading(true);
      const res = await fetch("/api/project");
      const data = await res.json();
      setProject(data.projects);
      setLoading(false);
    };
    getProjects();
  }, []);

  const moveReceipt = async () => {
    const res = await fetch(`/api/receipt/${receipt.id}/move`, {
      method: "PUT",
      body: JSON.stringify({
        projectId: parseInt(selectedProject),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setError(data);
  };

  const handleSubmit = async () => {
    if (selectedProject === "") {
      setError("Please select a project");
    }
    if (selectedProject !== "") {
      await moveReceipt();
      setIsReceiptRefreshed(true);
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
      <div className="bg-white rounded shadow-xl m-4 max-w-md w-full">
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
              <select
                className="w-full border-[1px] p-2 rounded-md border-slate-300 focus:border-emerald-900 focus:outline-none
              
              "
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                {receipt.project ? (
                  <option value={receipt.project.id}>
                    {receipt.project.name}
                  </option>
                ) : (
                  <option value="">Select a project</option>
                )}
                {receipt.project &&
                  project &&
                  project
                    .filter((p) => p.id !== receipt.project.id)
                    .map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                {!receipt.project &&
                  project &&
                  project.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
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

interface DeleteModalProps {
  setDeleteOpen: (value: boolean) => void;
  receipt: ReceiptType;
}

const DeleteModal = ({ receipt, setDeleteOpen }: DeleteModalProps) => {
  const [uploadError, setUploadError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsReceiptRefreshed } = useSearchContext();

  const deleteReceipt = async () => {
    const res = await fetch(`/api/receipt/${receipt.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.error) {
      setUploadError(data.error);
      setLoading(false);
    } else {
      setIsReceiptRefreshed(true);
      setUploadError("");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded border-emerald-900 border-[1px]">
        <h2 className="text-orange-600">
          Are you sure you want to delete receipt from {receipt.store}? This
          will delete all items in the receipt.
        </h2>

        <div className="mt-4 flex justify-between">
          <RegularButton
            handleClick={() => setDeleteOpen(false)}
            styles="bg-white text-emerald-900 text-base font-medium rounded-full w-auto border-[1px] border-emerald-900 text-xs"
          >
            Cancel
          </RegularButton>
          <RegularButton
            handleClick={deleteReceipt}
            styles="bg-emerald-900 text-white text-base font-medium rounded-full w-auto border-[1px] border-emerald-900 text-xs"
          >
            Confirm
          </RegularButton>
        </div>
      </div>
    </div>
  );
};
