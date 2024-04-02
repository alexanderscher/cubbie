import Loading from "@/components/Loading";
import React from "react";
import RegularButton from "../buttons/RegularButton";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface DeleteModalProps {
  cancelClick: (value: boolean) => void;
  deleteClick: () => void;
  error: string;
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
    <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
      <div className="relative p-10 bg-white  max-w-md m-auto flex-col flex  rounded-lg shadow-md gap-4 w-[400px] items-center">
        <div className="bg-red-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
          <ExclamationTriangleIcon className=" text-red-500 " />
        </div>

        <h1 className="text-xl">Delete {type} </h1>
        <p>{message}</p>

        <div className="mt-4 flex justify-between w-full">
          <RegularButton
            handleClick={() => cancelClick(false)}
            styles="bg-white text-red-500 text-base font-medium rounded-full w-auto border-[1px] border-red-500 text-xs"
          >
            No, Keep it.
          </RegularButton>
          <RegularButton
            handleClick={deleteClick}
            styles="bg-red-500 text-white text-base font-medium rounded-full w-auto border-[1px] border-red-500 text-xs"
          >
            Yes, Delete!
          </RegularButton>
        </div>
        {error && <p className="text-red-600 text-xs">{error}</p>}
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};

export default DeleteConfirmationModal;
