import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
  styles: string;
  submit?: boolean;
  restProps?: any;
  href?: string;
  small?: boolean;
}

const NonClickableButton = ({
  children,
  handleClick,
  styles,
  href = "",

  small = false,
  ...restProps
}: Props) => {
  return (
    <div
      className={` ${small ? "px-3 py-[6px]" : "px-5 py-[8px]"}
      border-[1.5px]
       
       rounded-3xl ${styles}`}
      onClick={handleClick}
      {...restProps}
    >
      {children}
    </div>
  );
};

export default NonClickableButton;
