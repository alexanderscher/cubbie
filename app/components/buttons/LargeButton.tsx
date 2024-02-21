import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
  styles?: string;
  restProps?: any;
  height?: string;
  text?: string;
  border?: string;
}

const LargeButton = ({
  children,
  handleClick,
  styles,
  height,
  text = "text-emerald-900",
  border = "border-emerald-900",

  ...restProps
}: Props) => {
  return (
    <div className={`flex w-full ${height}`}>
      <button
        type="button"
        className={`border-[1.5px]  w-full p-3 rounded-lg h-full ${text} ${border} ${styles}`}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </button>
    </div>
  );
};

export default LargeButton;
