"use client";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { use, useEffect, useState } from "react";

interface FormHeaderProps {
  children: React.ReactNode;
}

const FormHeader = ({ children }: FormHeaderProps) => {
  const [options, setOptions] = useState(false);
  const [name, setName] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.includes("/create/image")) {
      setName("Analyze Receipt Image");
    } else if (pathname.includes("/create/text")) {
      setName("Analyze Receipt Text");
    } else if (pathname.includes("/create/manual")) {
      setName("Manual Entry");
    }
  }, [pathname]);
  return (
    <div>
      <div className="border-b-[1px] border-emerald-900 flex justify-between pb-4">
        <h1 className="text-emerald-900 text-xl">Create Receipt</h1>
        <button
          onClick={() => setOptions(true)}
          className="bg outline outline-1 outline-emerald-900 rounded-full py-2 px-4 text-xs text-emerald-900 flex justify-between items-center gap-2"
        >
          <p className="">{name}</p>
          <Image
            src="/arrow_grey.png"
            width={8}
            height={8}
            alt="arrow"
            className="rotate-90"
          />
        </button>
      </div>
      {children}
      {options && (
        <ModalOverlay onClose={() => setOptions(false)}>
          <CreateReceipt setAddReceiptOpen={setOptions} />
        </ModalOverlay>
      )}
    </div>
  );
};

export default FormHeader;
