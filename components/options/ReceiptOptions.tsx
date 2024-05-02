"use client";
import { addItem } from "@/actions/items/addItem";
import { deleteReceipt } from "@/actions/receipts/deleteReceipt";
import { moveReceipt } from "@/actions/receipts/moveReceipt";
import RegularButton from "@/components/buttons/RegularButton";
import ImageModal from "@/components/images/ImageModal";
import { AddItem } from "@/components/item/AddItem";
import Loading from "@/components/Loading/Loading";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import ProjectSelect from "@/components/select/ProjectSelect";
import { getProjects } from "@/lib/projectsDB";
import { Receipt as ReceiptType, Item as ItemType } from "@/types/AppTypes";
import { Project } from "@/types/AppTypes";
import { DefaultReceipt } from "@/types/ProjectID";
import { ReceiptIDType } from "@/types/ReceiptId";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

interface OptionsModalProps {
  receipt: ReceiptType | ReceiptIDType;
}

const white =
  "bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer";
const green =
  "bg-[#d2edd2] hover:bg-[#b8dab8] text-emerald-900 rounded p-2 cursor-pointer";

export const ReceiptOptionsModal = ({ receipt }: OptionsModalProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const pathname = usePathname();
  const [color, setColor] = useState(white);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!pathname.startsWith("/receipt/")) {
      setColor(white);
    } else {
      setColor(green);
    }
  }, [pathname]);

  const [newItem, setNewItem] = useState({
    description: "",
    price: "0.00",
    barcode: "",
    character: "",
    photo: "",
    receipt_id: receipt.id,
  });

  const [error, setError] = useState({
    description: "",
    price: "",
    result: "",
  });

  const [isPending, startTransition] = useTransition();

  const itemSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
  });
  const handleSubmit = async () => {
    try {
      await itemSchema.validate(newItem, { abortEarly: false });

      startTransition(async () => {
        try {
          const result = await addItem(newItem);

          if (result?.error) {
            setError({ ...error, result: result.error });
          } else {
            setIsAddOpen(false);
            toast.success("Your operation was successful!");

            setNewItem({
              description: "",
              price: "",
              barcode: "",
              character: "",
              photo: "",
              receipt_id: receipt.id,
            });
            setError({
              description: "",
              price: "",
              result: "",
            });
          }
        } catch (e) {
          toast.error("An error occurred. Please try again.");
        }
      });
    } catch (error) {
      let errorsObject = {};

      if (error instanceof Yup.ValidationError) {
        errorsObject = error.inner.reduce((acc, curr) => {
          const key = curr.path || "unknownField";
          acc[key] = curr.message;
          return acc;
        }, {} as Record<string, string>);
      }

      setError(
        errorsObject as {
          description: string;
          price: string;
          result: string;
        }
      );
    }
  };

  return (
    <div>
      <div
        className={`absolute  shadow-1 -right-2 top-10 rounded-lg w-[200px] z-[2000] ${
          !pathname.startsWith("/receipt/") ? "bg-white" : " bg-[#97cb97] "
        }`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="p-4 rounded text-sm flex flex-col gap-2">
          {pathname === "/receipts" && (
            <Link href={`/project/${receipt.project?.id}`} className={color}>
              <div className="flex gap-2">
                <Image
                  src={"/folder.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <p>{receipt.project?.name}</p>
              </div>
            </Link>
          )}
          {pathname.startsWith("/receipt/") && (
            <div
              className={color}
              onClick={(e) => {
                e.preventDefault();
                setDetailsOpen(true);
              }}
            >
              <div className="flex gap-2">
                <Image
                  src={"/dashboard_b.png"}
                  width={20}
                  height={20}
                  alt=""
                ></Image>
                <p>Receipt Details</p>
              </div>
            </div>
          )}

          <div
            className={color}
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
          {/* )} */}
          <div className={color}>
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
          <div className={color}>
            <Link href={`/receipt/${receipt.id}/edit`}>
              <div className="flex gap-2">
                <Image src={"/edit.png"} width={20} height={20} alt=""></Image>
                <p>Edit</p>
              </div>
            </Link>
          </div>

          <div className={color}>
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
        {isOpen && (
          <ModalOverlay onClose={() => setIsOpen(false)}>
            <MoveModal setIsOpen={setIsOpen} receipt={receipt} />
          </ModalOverlay>
        )}
        {isAddOpen && (
          <ModalOverlay onClose={() => setIsAddOpen(false)}>
            <AddItem
              setIsAddOpen={setIsAddOpen}
              handleSubmit={handleSubmit}
              setNewItem={setNewItem}
              newItem={newItem}
              error={error}
              isPending={isPending}
            />
          </ModalOverlay>
        )}
        {isDeleteOpen && (
          <ModalOverlay onClose={() => setIsDeleteOpen(false)}>
            <DeleteModal setDeleteOpen={setIsDeleteOpen} receipt={receipt} />
          </ModalOverlay>
        )}
        {isDetailsOpen && (
          <ModalOverlay onClose={() => setDetailsOpen(false)}>
            <ReceiptDetails receipt={receipt} />
          </ModalOverlay>
        )}
      </div>
    </div>
  );
};

interface AddItemModalProps {
  setIsOpen: (value: boolean) => void;
  receipt: ReceiptType | ReceiptIDType;
}

const MoveModal = ({ setIsOpen, receipt }: AddItemModalProps) => {
  const [project, setProject] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [isPending, startTransition] = useTransition();
  console.log(project);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProject(data as Project[]);
    };
    fetchProjects();
  }, []);

  const handleSubmit = async () => {
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
        try {
          const result = await moveReceipt({
            id: receipt.id,
            projectId: parseInt(selectedProject),
          });
          if (result?.error) {
            toast.error("An error occurred. Please try again.");
          } else {
            setIsOpen(false);
            toast.success("Your operation was successful!");
          }
        } catch (e) {
          toast.error("An error occurred. Please try again.");
        }
      });
    }
  };

  return (
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
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

interface DeleteModalProps {
  setDeleteOpen: (value: boolean) => void;
  receipt: ReceiptType | ReceiptIDType;
}

const DeleteModal = ({ receipt, setDeleteOpen }: DeleteModalProps) => {
  const [isPending, startTransition] = useTransition();

  const deleteMethod = async () => {
    startTransition(async () => {
      try {
        const result = await deleteReceipt(receipt.id);
        if (result?.error) {
          toast.error("An error occurred. Please try again.");
        } else {
          setDeleteOpen(false);
          toast.success("Your operation was successful!");
        }
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <DeleteConfirmationModal
      cancelClick={setDeleteOpen}
      deleteClick={deleteMethod}
      isPending={isPending}
      type="Receipt"
      message={`Are you sure you want to delete ${receipt.store}? This will delete all receipts and items in the project.`}
    />
  );
};

const ReceiptDetails = ({
  receipt,
}: {
  receipt: ReceiptType | ReceiptIDType;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Calculate the total amount
    const calculatedTotal = receipt.items.reduce(
      (acc: number, curr: ItemType) => {
        return acc + curr.price;
      },
      0
    );

    // Update the total amount state variable
    setTotalAmount(calculatedTotal);
  }, [receipt]);

  return (
    <div
      className={`shadow rounded-lg bg-white flex flex-col gap-4 p-8 overflow-auto h-[600px]  max-w-[400px] w-3/4 mt-[50px]`}
    >
      {!receipt.receipt_image_url && (
        <div className="w-full flex justify-center items-center  ">
          <div className="  overflow-hidden">
            <Image
              src="/receipt_b.png"
              alt=""
              width={40}
              height={40}
              className="object-cover bg-white pt-4"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
      )}

      {receipt.receipt_image_url && (
        <div className="w-full flex justify-center items-center  ">
          <div className=" w-[200px] max-h-[200px]  rounded-lg overflow-hidden">
            <Image
              src={receipt.receipt_image_url}
              width={280}
              height={280}
              alt="Receipt Image"
              className="object-contain rounded-lg cursor-pointer"
              layout="intrinsic"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      )}
      <ImageModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        imageUrl={receipt.receipt_image_url}
        altText="Your Image Description"
      />

      <div className="flex flex-col gap-4 text-sm ">
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Return Date</p>
          <p className="">{formatDateToMMDDYY(receipt.return_date)}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Date Purcashed</p>
          <p className="">{formatDateToMMDDYY(receipt.purchase_date)}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Total Amount</p>
          <p className="">{formatCurrency(total_amount)}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Receipt Type</p>
          <p className="">{receipt.memo ? "Memo" : "Receipt"}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Quantity</p>
          <p className="">{receipt.items.length}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Created on</p>
          <p className="">{formatDateToMMDDYY(receipt.created_at)}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Purchase Type</p>
          <p className="">{receipt.type}</p>
        </div>

        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Card</p>
          <p className="">{receipt.card ? receipt.card : "None"}</p>
        </div>
        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Project Asset Amount</p>
          <p className="">
            {receipt.project &&
            receipt.project.asset_amount !== null &&
            receipt.project.asset_amount !== undefined
              ? receipt.project.asset_amount
              : "None"}
          </p>
        </div>

        <div className="w-full  border-slate-300 border-b-[1px] pb-2 ">
          <p className="text-slate-400 text-xs">Tracking Link</p>
          <p className="">
            {receipt.tracking_number ? receipt.tracking_number : "None"}
          </p>
        </div>
      </div>
    </div>
  );
};
