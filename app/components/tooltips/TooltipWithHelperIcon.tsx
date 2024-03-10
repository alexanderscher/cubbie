import { Tooltip } from "@material-tailwind/react";

interface TooltipWithHelperIconProps {
  content: string;
  placement?: string;
}

export function TooltipWithHelperIcon({
  content,
  placement = "top",
}: TooltipWithHelperIconProps) {
  return (
    <Tooltip
      animate={{
        mount: { scale: 1, y: 0 },
        unmount: { scale: 0, y: 25 },
      }}
      placement={placement}
      className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10 z-[2001]"
      content={
        <div className="w-80 ">
          <p className="text-orange-600">{content}</p>
        </div>
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        className="h-5 w-5 cursor-pointer text-orange-600"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
        />
      </svg>
    </Tooltip>
  );
}
