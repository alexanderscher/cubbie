import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
  styles: string;
}

const RegularButton = ({ children, handleClick, styles }: Props) => {
  return (
    <button
      className={`
       
      border-[1.5px] px-4 py-[6px] rounded-3xl ${styles}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default RegularButton;
