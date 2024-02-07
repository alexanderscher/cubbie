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

  type = "button",
  ...restProps
}: Props) => {
  return (
    <button
      type={type}
      className={`
       
      border-[1.5px]
       px-6 py-[8px]
       rounded-3xl ${styles}`}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default RegularButton;
