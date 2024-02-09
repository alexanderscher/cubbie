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
}

const RegularButton = ({
  children,
  handleClick,
  styles,
  href = "",
  type = "button",
  ...restProps
}: Props) => {
  console.log("href", href);
  if (href) {
    return (
      <Link href={href}>
        <button
          type={type}
          className={`
      border-[1.5px]
       px-5 py-[6px]
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
        className={`
      border-[1.5px]
       px-5 py-[8px]
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
