import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
  styles?: string;
  restProps?: any;
  type?: "button" | "submit" | "reset" | undefined;
}

const LargeButton = ({
  children,
  handleClick,
  styles,

  type,
  ...restProps
}: Props) => {
  return (
    <div className="flex w-full">
      <button
        className={`border-[1.5px] border-green-900 w-full p-3 rounded-md text-green-900 ${styles}`}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </button>
    </div>
  );
};

export default LargeButton;
