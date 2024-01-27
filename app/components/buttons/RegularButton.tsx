import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
  styles: string;
  submit?: boolean;
  restProps?: any;
  type?: "button" | "submit" | "reset" | undefined;
}

const RegularButton = ({
  children,
  handleClick,
  styles,
  submit = false,
  type,
  ...restProps
}: Props) => {
  return (
    <button
      className={`
       
      border-[1.5px] ${
        !submit ? "sm:px-4 sm:py-[6px] px-3 py-[4px]" : "px-6 py-[8px]"
      } rounded-3xl ${styles}`}
      onClick={handleClick}
      type={type}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default RegularButton;
