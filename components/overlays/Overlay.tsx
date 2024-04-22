interface OverlayProps {
  onClose: () => void;
}

export const Overlay = ({ onClose }: OverlayProps) => {
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "options-overlay"
    ) {
      onClose();
    }
  };
  return (
    <div
      id="options-overlay"
      className={`fixed top-0 left-0 w-full h-full  z-[1000] flex justify-center items-center`}
      onClick={handleOverlayClick}
    ></div>
  );
};
