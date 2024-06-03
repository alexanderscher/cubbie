import Loading from "@/components/Loading/Loading";
import React from "react";
import RegularButton from "../buttons/RegularButton";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface DeleteModalProps {
  cancelClick: (value: boolean) => void;
  deleteClick: () => void;
  error?: string;
  isPending: boolean;
  message: string;
  type: string;
}
const DeleteConfirmationModal = ({
  cancelClick,
  deleteClick,
  error,
  isPending,
  message,
  type,
}: DeleteModalProps) => {
  return (
    <div
      className=" flex flex-col items-center gap-4 text-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
        <ExclamationTriangleIcon className=" text-red-400 w-3/4 h-1/2" />
      </div>

      <h1 className="text-xl text-center text-red-400">Delete {type} </h1>
      <p className="text-sm text-cente text-red-400">{message}</p>

      <div className="mt-4 flex justify-between w-full gap-3">
        <RegularButton
          handleClick={() => cancelClick(false)}
          styles="text-red-400 text-red-400 text-base font-medium rounded-full w-auto border-[1px] border-red-500 text-xs bg-red-50 w-full"
        >
          No, Keep it.
        </RegularButton>
        <RegularButton
          handleClick={deleteClick}
          styles="bg-red-400 text-white text-base font-medium rounded-full w-auto border-[1px] border-red-400 text-xs w-full"
        >
          Yes, Delete!
        </RegularButton>
      </div>
      {error && <p className="text-red-600 text-xs">{error}</p>}
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

export default DeleteConfirmationModal;
