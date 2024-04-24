"use client";

import { ItemOptionsModal } from "@/components/options/ItemsOptions";
import { Overlay } from "@/components/overlays/Overlay";
import { TruncateText } from "@/components/text/Truncate";
import { Project } from "@/types/AppTypes";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  item: any;
  isOpen: boolean;
  onToggleOpen: (event: React.MouseEvent<HTMLDivElement>) => void;
  project?: Project;
  setOpenItemId: (id: number | null) => void;
}

const Item = ({
  item,
  isOpen,
  onToggleOpen,
  project,
  setOpenItemId,
}: Props) => {
  const pathname = usePathname();

  return (
    <div className="box justify-between relative">
      <Link href={`/item/${item.id}`} className="">
        <div className="">
          {item.photo_url && (
            <div className="w-full h-[110px] overflow-hidden flex justify-center flex-shrink-0 flex-col relative">
              <Image
                src={item.photo_url}
                alt=""
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-t-lg"
                style={{ objectPosition: "top" }}
              />
              {pathname.startsWith("/receipt") &&
                project &&
                project.asset_amount !== null &&
                project.asset_amount !== undefined &&
                project.asset_amount < item.price && (
                  <p className="absolute top-2 left-2 flex  text-orange-600 text-xs border-[1px] border-orange-600 rounded-full px-3 py-1">
                    Asset
                  </p>
                )}

              {pathname === "/items" && item?.receipt?.expired && (
                <div className="absolute top-0 left-0 w-full h-full bg-orange-400 opacity-30  rounded-t-lg"></div>
              )}
              {pathname === "/items" && item?.receipt?.expired && (
                <p className="absolute top-2 left-2 flex  text-orange-600 text-xs border-[1px] border-orange-600 rounded-full px-3 py-1">
                  Expired
                </p>
              )}

              <Image
                src="/three-dots.png"
                className="absolute top-0 right-2 cursor-pointer z-10"
                alt=""
                width={20}
                height={20}
                onClick={onToggleOpen}
              />
            </div>
          )}

          {!item.photo_url && (
            <div className="">
              <div
                className={`w-full h-[110px] overflow-hidden  flex justify-center items-center  rounded-t-lg ${
                  pathname === "/items" && item?.receipt?.expired
                    ? "bg-orange-400 opacity-30"
                    : "bg-slate-100"
                }`}
              >
                {pathname.startsWith("/receipt") &&
                  project &&
                  project.asset_amount !== null &&
                  project.asset_amount !== undefined &&
                  project.asset_amount < item.price && (
                    <p className="absolute top-2 left-2 flex  text-orange-600 text-xs border-[1px] border-orange-600 rounded-full px-3 py-1">
                      Asset
                    </p>
                  )}
                <div className="w-full h-full flex justify-center items-center">
                  <Image
                    src="/item_b.png"
                    alt=""
                    width={50}
                    height={50}
                    className="object-cover "
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
              {pathname === "/items" && item?.receipt?.expired && (
                <p className="absolute top-2 left-2 flex  text-orange-600 text-xs border-[1px] border-orange-600 rounded-full px-3 py-1">
                  Expired
                </p>
              )}
              <Image
                src="/three-dots.png"
                className="absolute top-0 right-2 cursor-pointer "
                alt=""
                width={20}
                height={20}
              />
              <Image
                src="/three-dots.png"
                className="absolute top-0 right-2 cursor-pointer "
                alt=""
                width={20}
                height={20}
                onClick={onToggleOpen}
              />
            </div>
          )}
          <div className="p-3 flex flex-col  ">
            <div className="">
              <TruncateText
                text={item.description}
                styles={"text-orange-600 text-sm"}
                maxLength={25}
              />
            </div>

            <div className="pt-2">
              <div className=" flex flex-col  gap-1 text-xs ">
                {pathname === "/items" && (
                  <div className="">
                    <p className="text-slate-400  ">Return Date</p>
                    <p className="">
                      {formatDateToMMDDYY(item.receipt.return_date)}
                    </p>
                  </div>
                )}
                <div className="">
                  <p className="text-slate-400  ">Price</p>
                  <p className="">{formatCurrency(item.price)}</p>
                </div>

                {pathname.includes("receipt") && (
                  <div className="">
                    <p className="text-slate-400  ">Barcode</p>
                    <p className="">{item.barcode ? item.barcode : "None"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`${
            item.returned
              ? "border-t-orange-600 text-orange-600"
              : "border-t-emerald-900"
          } border-t-[1px] text-xs text-center  text-emerald-900 p-2`}
        >
          {item.returned ? (
            <p className="text-orange-600">Returned</p>
          ) : (
            <p>In possesion</p>
          )}
        </div>
      </Link>
      {isOpen && (
        <>
          <Overlay onClose={() => setOpenItemId(null)} />
          <ItemOptionsModal item={item} />
        </>
      )}
    </div>
  );
};

export default Item;
