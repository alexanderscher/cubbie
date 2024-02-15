import React from "react";

interface Props {
  children: React.ReactNode;
  handleClick?: () => void;
  styles?: string;
  restProps?: any;
  height?: string;
}

const LargeButton = ({
  children,
  handleClick,
  styles,
  height,

  ...restProps
}: Props) => {
  return (
    <div className={`flex w-full ${height}`}>
      <button
        type="button"
        className={`border-[1.5px] text-emerald-900  border-emerald-900 w-full p-3 rounded-md h-full ${styles}`}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </button>
    </div>
  );
};

export default LargeButton;
