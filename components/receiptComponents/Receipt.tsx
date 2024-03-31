"use client";
import { deleteReceipt } from "@/actions/receipts/deleteReceipt";
import { moveReceipt } from "@/actions/receipts/moveReceipt";
import RegularButton from "@/components/buttons/RegularButton";
import { FormError } from "@/components/form-error";
import { AddItem } from "@/components/item/AddItem";
import Loading from "@/components/Loading";
import ProjectSelect from "@/components/select/ProjectSelect";
import { TruncateText } from "@/components/text/Truncate";
import { getProjects } from "@/lib/projectsDB";
import { Item, Receipt as ReceiptType } from "@/types/AppTypes";
import { Project } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

interface ReceiptProps {
  receipt: ReceiptType;
  isOpen: boolean;
  onToggleOpen: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Receipt = ({ receipt, onToggleOpen, isOpen }: ReceiptProps) => {
  console.log(receipt);
  const total_amount = receipt.items.reduce((acc: number, curr: Item) => {
    return acc + curr.price;
  }, 0);
  return (
    <div className="box xs:pb-6 pb-4 relative ">
      <Link href={`/receipt/${receipt.id}`}>
        <div className="w-full  overflow-hidden relative flex justify-center items-center bg-slate-100 rounded-t-lg h-[90px]">
          <div className="w-full h-full flex justify-center items-center ">
            <Image
              src="/receipt_b.png"
              alt=""
              width={24}
              height={24}
              className="object-cover "
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            {receipt?.expired && (
              <div className="absolute top-0 left-0 w-full h-full bg-orange-400 opacity-30 rounded-t-lg"></div>
            )}
            {receipt?.expired && (
              <p className="absolute top-2 left-2 flex  text-orange-600 text-xs border-[1px] border-orange-600 rounded-full px-3 py-1">
                Expired
              </p>
            )}
            <Image
              src="/three-dots.png"
              className="absolute top-0 right-2 cursor-pointer "
              alt=""
              width={20}
              height={20}
              onClick={onToggleOpen}
            />
          </div>
        </div>
        {isOpen && <OptionsModal receipt={receipt} />}

        <div className="p-3 flex flex-col justify-between">
          <div className="">
            <TruncateText
              text={receipt.store}
              maxLength={18}
              styles={"text-orange-600"}
            />

            <p className="text-xs text-slate-400">
              Return by {formatDateToMMDDYY(receipt.return_date)}
            </p>
          </div>

          <div className="flex flex-col  gap-1 text-xs">
            <div className="flex gap-1  mt-2">
              <p className=" ">
                {receipt.items.length}{" "}
                {receipt.items.length === 1 ? "item" : "items"} |
              </p>
              <p className=" ">{formatCurrency(total_amount)}</p>
            </div>
          </div>
        </div>
      </Link>
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
  return (
    <div
      className="absolute bg-white shadow-1 -right-4 top-6 rounded-md  w-[200px] z-100"
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <div className="p-4 rounded text-sm flex flex-col gap-2">
        <div
          className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            setIsAddOpen(true);
          }}
        >
          <div className="flex gap-2">
            <Image src={"/add.png"} width={20} height={20} alt=""></Image>
            <p>Add item</p>
          </div>
        </div>
        <div className="bg-slate-100 hover:bg-slate-200 rounded-md w-full p-2 hover:cursor-pointer">
          <div
            className="flex gap-2"
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
          >
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
            onClick={(e) => {
              e.preventDefault();
              setIsDeleteOpen(true);
            }}
          >
            <Image src={"/trash.png"} width={20} height={20} alt=""></Image>
            <p>Delete</p>
          </div>
        </div>
      </div>
      {isOpen && <MoveModal setIsOpen={setIsOpen} receipt={receipt} />}
      {isAddOpen && <AddItem setIsAddOpen={setIsAddOpen} id={receipt.id} />}
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
  const [uploadError, setUploadError] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProject(data as Project[]);
    };
    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    console.log(selectedProject, receipt.project_id);
    if (selectedProject === receipt.project_id.toString()) {
      setError("Receipt is already in this project");
      return;
    }
    if (selectedProject === "") {
      setError("Please select a project");
      return;
    }

    if (selectedProject !== "") {
      startTransition(async () => {
        const result = await moveReceipt({
          id: receipt.id,
          projectId: parseInt(selectedProject),
        });
        if (result?.error) {
          setUploadError(result.error);
        } else {
          setIsOpen(false);
        }
      });
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
      onClick={(e) => {
        e.preventDefault();
        handleOverlayClick(e);
      }}
    >
      <div className="bg-white rounded shadow-xl m-4 max-w-md w-full">
        <div className="flex justify-between items-center border-b border-emerald-900 px-5 py-3 rounded-t-lg">
          <h3 className="text-md text-emerald-900">Move project</h3>
          <button
            type="button"
            className="emerald-900"
            onClick={() => setIsOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                {project && (
                  <ProjectSelect
                    projects={project}
                    handleChange={setSelectedProject}
                    values={selectedProject}
                    errors={error}
                    color="green"
                  ></ProjectSelect>
                )}

                {error && <p className="text-orange-900 text-xs">{error}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <RegularButton
                type="button"
                styles=" text-white border-emerald-900"
                handleClick={handleSubmit}
              >
                <p className="text-xs text-emerald-900">Move</p>
              </RegularButton>
            </div>
          </div>

          {uploadError && <FormError message={uploadError}></FormError>}
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

interface DeleteModalProps {
  setDeleteOpen: (value: boolean) => void;
  receipt: ReceiptType;
}

const DeleteModal = ({ receipt, setDeleteOpen }: DeleteModalProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const deleteMethod = async () => {
    startTransition(async () => {
      const result = await deleteReceipt(receipt.id);
      if (result?.error) {
        console.log(result.error);
        setError("Error deleting receipt");
      } else {
        setDeleteOpen(false);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex ">
      <div className="relative p-8 bg-orange-100  max-w-md m-auto flex-col flex  rounded shadow-md gap-4 w-3/4">
        <div>
          <h2 className="text-emerald-900 text-sm">
            Are you sure you want to delete receipt from {receipt.store}? This
            will delete all items in the receipt.
          </h2>

          <div className="mt-4 flex justify-between">
            <RegularButton
              handleClick={() => setDeleteOpen(false)}
              styles="bg-orange-100 text-emerald-900 text-base font-medium rounded-full w-auto border-[1px] border-emerald-900 text-xs"
            >
              Cancel
            </RegularButton>
            <RegularButton
              handleClick={deleteMethod}
              styles="bg-emerald-900 text-white text-base font-medium rounded-full w-auto border-[1px] border-emerald-900 text-xs"
            >
              Confirm
            </RegularButton>
          </div>
        </div>

        {error && <FormError message={error}></FormError>}
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
