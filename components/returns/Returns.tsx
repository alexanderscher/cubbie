"use client";
import { createReturnPolicy } from "@/actions/return-policy/returns";
import RegularButton from "@/components/buttons/RegularButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { FormError } from "@/components/form-error";
import Loading from "@/components/Loading/Loading";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import SearchBar from "@/components/search/SearchBar";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

interface ReturnsProps {
  returns: any;
}

const Returns = ({ returns }: ReturnsProps) => {
  console.log(returns);
  const [createNew, setCreateNew] = useState(false);
  return (
    <div className="w-full max-w-[760px]">
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl text-emerald-900">Return Policies</h1>
          <RegularButton
            styles="border-emerald-900"
            handleClick={() => setCreateNew(true)}
          >
            <p className="text-xs text-emerald-900">Create new </p>
          </RegularButton>
        </div>
        <SearchBar searchType="Returns" />
      </div>
      <div className="w-full flex flex-col gap-6">
        {returns.map((item: any) => (
          <div key={item.id} className="flex flex-col gap-4">
            <div className="bg-white w-full p-4 rounded-lg shadow flex justify-between items-start">
              <div className="">
                <p className="text-orange-600 text-md">{item.store}</p>
                <p className="text-sm">{item.days}</p>
              </div>
              <div>
                <Image
                  src="/three-dots.png"
                  className=""
                  alt=""
                  width={20}
                  height={20}
                  // onClick={onToggleOpen}
                />
              </div>
            </div>
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
            toast.success("Your operation was successful!");
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
    <div className="">
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
