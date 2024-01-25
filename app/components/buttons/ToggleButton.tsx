import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
  value: boolean;
  styles?: string;
}

const ToggleButton = ({ children, handleClick, value, styles }: Props) => {
  return (
    <button
      className={`${
        value ? "bg-green-700 text-white" : "text-green-700"
      } border-[1.5px] px-4 py-[6px] rounded-3xl border-green-700 ${styles}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default ToggleButton;
