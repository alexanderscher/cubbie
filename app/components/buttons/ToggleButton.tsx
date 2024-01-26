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
        value ? "bg-green-900 text-white" : "text-green-900"
      } border-[1.5px] px-4 py-[6px] rounded-3xl border-green-900 ${styles}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default ToggleButton;
