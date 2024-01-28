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
        !submit ? "px-4 py-[6px]" : "px-6 py-[8px]"
      } rounded-3xl ${styles}`}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default RegularButton;
