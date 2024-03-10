import { Tooltip } from "@material-tailwind/react";

interface TooltipWithHelperIconProps {
  content: string;
  placement?: string;
  item: string;
  date: string;
}

export function TooltipComponent({
  content,
  placement = "top",
  item,
  date,
}: TooltipWithHelperIconProps) {
  return (
    <Tooltip
      placement={placement}
      className="border border-blue-gray-50 bg-white p-6 shadow-xl shadow-black/10 z-[2001]"
      content={
        <div className="w-[200px] min-h-[60px]">
          <p className="text-black text-lg">{content}</p>
          <p className="text-slate-400 text-sm">{date}</p>
        </div>
      }
    >
      <p>{item}</p>
    </Tooltip>
  );
}
