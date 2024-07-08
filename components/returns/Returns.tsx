"use client";
import {
  createReturnPolicy,
  deletePolicy,
  updatePolicy,
} from "@/actions/return-policy/returns";
import RegularButton from "@/components/buttons/RegularButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { FormError } from "@/components/form-error";
import Loading from "@/components/loading-components/Loading";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import SearchBar from "@/components/search/SearchBar";
import { Overlay } from "@/components/overlays/Overlay";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import { ReturnType } from "@/types/Return";
import { Return } from "@prisma/client/runtime/library";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";

interface ReturnsProps {
  returns: ReturnType[];
}

const Returns = ({ returns }: ReturnsProps) => {
  const [createNew, setCreateNew] = useState(false);

  return (
    <div className="w-full max-w-[760px]">
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-emerald-900">Return Policies</h1>
            <TooltipWithHelperIcon
              placement="right-start"
              content="Keep your return policies here for easy access. You can use them when creating a receipt for a return date."
            />
          </div>

          <RegularButton
            styles="border-emerald-900"
            handleClick={() => setCreateNew(true)}
          >
            <p className="text-xs text-emerald-900">Create new </p>
          </RegularButton>
        </div>
        <SearchBar searchType="Returns" />
      </div>
      {returns.length === 0 && (
        <div className="w-full flex justify-center flex-col items-center gap-5 mt-20">
          <Image
            src="/green/store_green.png"
            alt=""
            width={50}
            height={50}
            className="object-cover "
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <h1 className="text-xl text-emerald-900">No return policies</h1>
        </div>
      )}
      <div className="w-full flex flex-col gap-6">
        {returns.length > 0 &&
          returns.map((item: any) => (
            <div key={item.id} className="relative">
              <Row item={item} />
            </div>
          ))}
      </div>
      {createNew && (
        <ModalOverlay onClose={() => setCreateNew(false)}>
          <AddReturnPolicy setCreateNew={setCreateNew} />
        </ModalOverlay>
      )}
    </div>
  );
};

export default Returns;

const Row = ({ item }: any) => {
  const [isOpen, setOpenItemId] = useState(false);
  return (
    <>
      <div key={item.id} className="flex flex-col gap-4 ">
        <div className="bg-white w-full p-4 rounded-lg shadow flex justify-between items-start">
          <div className="">
            <p className="text-orange-600 text-md">{item.store}</p>
            <p className="text-sm">{item.days}</p>
          </div>
          <div>
            <Image
              src="/three-dots.png"
              className="cursor-pointer"
              alt=""
              width={20}
              height={20}
              onClick={() => setOpenItemId(item.id)}
            />
          </div>
        </div>
      </div>
      {isOpen && (
        <>
          <Overlay onClose={() => setOpenItemId(false)} />
          <ReturnOptionsModal item={item} />
        </>
      )}
    </>
  );
};

interface AddReturnPolicyProps {
  setCreateNew: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddReturnPolicy = ({ setCreateNew }: AddReturnPolicyProps) => {
  const [returnPolicy, setReturnPolicy] = useState({
    store: "",
    days: 0,
  });
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (returnPolicy.store === "") {
      setError("Please enter a store name");
    } else {
      try {
        startTransition(async () => {
          const result = await createReturnPolicy(
            returnPolicy.store,
            returnPolicy.days
          );
          if (result.error) {
            setError(result.error);
            toast.error("An error occurred. Please try again.");
          } else {
            toast.success("Return policy created successfully");
            setReturnPolicy({
              store: "",
              days: 0,
            });
            setCreateNew(false);
          }
        });
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3  rounded-t-lg">
        <h3 className="text-md text-emerald-900">Create Return Policy</h3>
        <button
          type="button"
          className="text-emerald-900"
          onClick={() => setCreateNew(false)}
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900 mb-2">Store name*</p>
              <input
                type="text"
                name="store"
                value={returnPolicy.store}
                onChange={(e) =>
                  setReturnPolicy({ ...returnPolicy, store: e.target.value })
                }
                className="w-full p-2 border-[1px] rounded border-emerald-900 focus:outline-none"
              />
              {error && <p className="text-orange-900 text-xs">{error}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900 mb-2">
                Number of days until return
              </p>
              <input
                type="text"
                name="days"
                value={returnPolicy.days}
                onChange={(e) => {
                  const newValue = e.target.value;

                  if (/^\d*$/.test(newValue)) {
                    setReturnPolicy({
                      ...returnPolicy,
                      days: newValue === "" ? 0 : Number(newValue),
                    });
                  }
                }}
                className="w-full p-2 border-[1px] rounded border-emerald-900 focus:outline-none"
              />
              {error && <p className="text-orange-900 text-xs">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <SubmitButton
              type="button"
              disabled={!returnPolicy.days && !returnPolicy.store}
              handleClick={handleSubmit}
              loading={isPending}
            >
              <p className="text-sm">Save Policy</p>
            </SubmitButton>
          </div>

          {error && <FormError message={error} />}
        </div>
        {isPending && <Loading loading={isPending} />}
      </div>
    </div>
  );
};

interface OptionsModalProps {
  item: any;
}

export const ReturnOptionsModal = ({ item }: OptionsModalProps) => {
  const [isPending, startTransition] = useTransition();
  const [isEditOpen, setEditOpen] = useState(false);

  const deleteMethod = () => {
    startTransition(async () => {
      try {
        const result = await deletePolicy(item.id);

        if (result?.error) {
          toast.error("An error occurred. Please try again.");
        } else {
          toast.success("Policy deleted successfully");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      }
    });
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
      }}
    >
      <div
        className={
          "absolute  shadow-1 -right-2 top-10 rounded-lg w-[200px] z-[2000]  bg-white"
        }
      >
        <div className="p-4 rounded text-sm flex flex-col gap-2">
          <div
            className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2 cursor-pointer"
            onClick={() => setEditOpen(true)}
          >
            <div className="flex gap-2">
              <Image
                src={"/green/edit_green.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
              <p>Edit</p>
            </div>
          </div>

          <div className="bg-slate-100 hover:bg-slate-200 rounded-lg w-full p-2">
            <div className="flex gap-2 cursor-pointer" onClick={deleteMethod}>
              <Image
                src={"/green/trash_green.png"}
                width={20}
                height={20}
                alt=""
              ></Image>
              <p>Delete Item</p>
            </div>
          </div>
        </div>

        <div className="z-[2000]"></div>
      </div>
      {isEditOpen && (
        <ModalOverlay onClose={() => setEditOpen(false)}>
          <EditPolicy item={item} setEditOpen={setEditOpen} />
        </ModalOverlay>
      )}
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

interface EditPolicyProps {
  item: ReturnType;
  setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditPolicy = ({ item, setEditOpen }: EditPolicyProps) => {
  const [returnPolicy, setReturnPolicy] = useState({
    store: item.store,
    days: item.days,
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (returnPolicy.store === item.store && returnPolicy.days === item.days) {
      return;
    } else if (returnPolicy.store === "") {
      setError("Please enter a store name");
    } else {
      try {
        startTransition(async () => {
          const result = await updatePolicy(
            item.id,
            returnPolicy.store,
            returnPolicy.days
          );
          if (result.error) {
            setError(result.error);
            toast.error("An error occurred. Please try again.");
          } else {
            toast.success("Policy updated successfully");
            setReturnPolicy({
              store: "",
              days: 0,
            });
            setEditOpen(false);
          }
        });
      } catch (e) {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3  rounded-t-lg">
        <h3 className="text-md text-emerald-900">Edit Return Policy</h3>
        <button
          type="button"
          className="text-emerald-900"
          onClick={() => setEditOpen(false)}
        >
          <span className="text-2xl">&times;</span>
        </button>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900 mb-2">Store name*</p>
              <input
                type="text"
                name="store"
                value={returnPolicy.store}
                onChange={(e) =>
                  setReturnPolicy({ ...returnPolicy, store: e.target.value })
                }
                className="w-full p-2 border-[1px] rounded border-emerald-900 focus:outline-none"
              />
              {error && <p className="text-orange-900 text-xs">{error}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900 mb-2">
                Number of days until return
              </p>
              <input
                type="text"
                name="days"
                value={returnPolicy.days}
                onChange={(e) => {
                  const newValue = e.target.value;

                  if (/^\d*$/.test(newValue)) {
                    setReturnPolicy({
                      ...returnPolicy,
                      days: newValue === "" ? 0 : Number(newValue),
                    });
                  }
                }}
                className="w-full p-2 border-[1px] rounded border-emerald-900 focus:outline-none"
              />
              {error && <p className="text-orange-900 text-xs">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <SubmitButton
              type="button"
              disabled={!returnPolicy.days}
              handleClick={handleSubmit}
            >
              <p className="text-xs">Save Policy</p>
            </SubmitButton>
          </div>

          {error && <FormError message={error} />}
        </div>
        {isPending && <Loading loading={isPending} />}
      </div>
    </div>
  );
};
