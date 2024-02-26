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
  border = "border-emerald-900 border-[1px]",

  ...restProps
}: Props) => {
  return (
    <div className={`flex w-full ${height} rounded-lg`}>
      <button
        type="button"
        className={`w-full p-4  h-full rounded-lg ${text} ${border} ${styles}`}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </button>
    </div>
  );
};

export default LargeButton;
