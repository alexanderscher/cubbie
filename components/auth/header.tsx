import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Image
        src="/logo/cubbielogo.png"
        alt=""
        width={100}
        height={100}
        className="object-cover "
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
