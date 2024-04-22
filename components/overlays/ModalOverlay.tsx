interface OverlayProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalOverlay = ({ onClose, children }: OverlayProps) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      onClose();
    }
  };
  return (
    <div
      id="modal-overlay"
      className={`fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[2000]`}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};
