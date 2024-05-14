"use client";
import RegularButton from "@/components/buttons/RegularButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { FormError } from "@/components/form-error";
import Loading from "@/components/Loading/Loading";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { CreateProject } from "@/components/project/CreateProject";
import SearchBar from "@/components/search/SearchBar";
import Image from "next/image";
import React, { useState } from "react";

const Returns = () => {
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
      <div className="w-full flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className="bg-white w-full p-4 rounded-lg shadow flex justify-between items-start">
            <div className="">
              <p className="text-orange-600 text-md">Store name</p>
              <p className="text-sm">20 days</p>
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
      </div>
      {createNew && (
        <ModalOverlay onClose={() => setCreateNew(false)}>
          <AddReturnPolicy />
        </ModalOverlay>
      )}
    </div>
  );
};

export default Returns;

const AddReturnPolicy = () => {
  return (
    <div className="">
      <div className="flex justify-between items-center border-b border-emerald-900 px-6 py-3  rounded-t-lg">
        <h3 className="text-md text-emerald-900">Create Return Policy</h3>
        <button
          type="button"
          className="text-emerald-900"
          // onClick={() => setAddProjectOpen(false)}
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
                name="description"
                // value={project.name}
                // onChange={(e) =>
                //   setProject({ ...project, name: e.target.value })
                // }
                className="w-full p-2 border-[1px] rounded border-emerald-900 focus:outline-none"
              />
              {/* {error && <p className="text-orange-900 text-xs">{error}</p>} */}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900 mb-2">
                Number of days until return
              </p>
              <input
                type="text"
                name="description"
                // value={project.name}
                // onChange={(e) =>
                //   setProject({ ...project, name: e.target.value })
                // }
                className="w-full p-2 border-[1px] rounded border-emerald-900 focus:outline-none"
              />
              {/* {error && <p className="text-orange-900 text-xs">{error}</p>} */}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <SubmitButton
              type="button"
              // disabled={!project.name}
              // handleClick={handleSubmit}
            >
              <p className="text-xs">Save Policy</p>
            </SubmitButton>
          </div>

          {/* {uploadError && <FormError message={uploadError} />} */}
        </div>
        {/* {isPending && <Loading loading={isPending} />} */}
      </div>
    </div>
  );
};
