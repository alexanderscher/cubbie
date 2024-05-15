import React, { useEffect } from "react";

interface OverlayProps {
  onClose: () => void;
  children: React.ReactNode;
  isDelete?: boolean;
}

export const ModalOverlay = ({
  onClose,
  children,
  isDelete = false,
}: OverlayProps) => {
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
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[20000]"
      onClick={handleOverlayClick}
    >
      {/* This container should not be w-full to allow clicking to the sides to close the modal */}
      <div
        className={
          isDelete
            ? "relative p-8 bg-red-50  w-3/4 m-auto   rounded-lg shadow-md gap-4 max-w-[340px] min-w-[310px] "
            : "bg-white rounded-lg shadow-xl m-4 max-w-md w-full flex justify-center"
        }
      >
        {children}
      </div>
    </div>
  );
};
