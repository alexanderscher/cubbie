"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";

interface ModalProps {
  message: string;
  onClose?: () => void;
}

const SubscribeModal = ({ message, onClose }: ModalProps) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.currentTarget === event.target) {
      if (onClose) {
        onClose();
      }
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-10 z-[20000] flex justify-center items-center"
      onClick={handleOverlayClick}
    >
      <div className="relative p-10 bg-white  max-w-md m-auto flex-col flex  rounded-lg shadow-md gap-4 w-[340px] items-center ">
        <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
          <ExclamationTriangleIcon className=" text-orange-600 w-3/4 h-1/2" />
        </div>
        <h2 className="text-xl font-semibold text-orange-600 text-center">
          Upgrade
        </h2>
        <div className="mt-3 text-sm text-orange-600 text-center">
          <p>{message}</p>
        </div>
        <div className="mt-4 flex flex-col w-full gap-4 justify-between">
          <RegularButton
            styles=" bg-orange-600 text-white rounded-full border-[1px]   border-orange-600 w-full text-sm "
            href="/manage-plan"
          >
            Subscribe
          </RegularButton>
          <RegularButton
            styles="  text-orange-600 rounded-full border-[1px]  border-orange-600 w-full text-sm"
            href="/"
          >
            Home
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
