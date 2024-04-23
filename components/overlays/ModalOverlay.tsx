import React, { useEffect } from "react";

interface OverlayProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalOverlay = ({ onClose, children }: OverlayProps) => {
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
      className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[2000]"
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};
