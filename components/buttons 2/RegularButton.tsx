import Link from "next/link";
import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
  styles: string;
  submit?: boolean;
  restProps?: any;
  type?: "button" | "submit" | "reset" | undefined;
  href?: string;
  small?: boolean;
}

const RegularButton = ({
  children,
  handleClick,
  styles,
  href = "",
  type = "button",
  small = false,
  ...restProps
}: Props) => {
  if (href) {
    return (
      <Link href={href}>
        <button
          type={type}
          className={` ${small ? "px-4 py-[6px]" : "px-6 py-[8px]"}
      border-[1px]
       
       rounded-3xl ${styles}`}
          onClick={handleClick}
          {...restProps}
        >
          {children}
        </button>
      </Link>
    );
  } else {
    return (
      <button
        type={type}
        className={` ${small ? "px-4 py-[6px]" : "px-6 py-[8px]"}
      border-[1px]
       
       rounded-3xl ${styles}`}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </button>
    );
  }
};

export default RegularButton;
