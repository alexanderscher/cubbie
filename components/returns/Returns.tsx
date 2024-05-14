"use client";
import RegularButton from "@/components/buttons/RegularButton";
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
              <p className="text-sm">30 days</p>
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
          <CreateProject setAddProjectOpen={setCreateNew} />
        </ModalOverlay>
      )}
    </div>
  );
};

export default Returns;
