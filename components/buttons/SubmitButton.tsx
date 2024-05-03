interface SubmitButtonProps {
  children: React.ReactNode;
  handleClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void; // Make event parameter optional
  styles?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  small?: boolean;
  restProps?: any;
}

export const SubmitButton = ({
  children,
  handleClick,
  styles,
  disabled = false,
  type = "button",
  small = false,
  ...restProps
}: SubmitButtonProps) => {
  return (
    <button
      type={type}
      className={`${small ? "px-4 py-[6px]" : "px-6 py-[8px]"} 
        rounded-3xl border-[1px]
        ${
          disabled
            ? "text-emerald-900 border-emerald-900 cursor-not-allowed"
            : `text-white bg-emerald-900 border-emerald-900`
        }`}
      onClick={handleClick}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
