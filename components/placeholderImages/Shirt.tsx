import Image from "next/image";
import React from "react";

const Shirt = () => {
  return (
    <div className="w-full h-[110px] overflow-hidden  flex justify-center items-center bg-slate-100 rounded-t-lg">
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
      {/* {pathname === "/items" && item?.receipt?.expired && (
                  <p className="text-orange-600">Expired</p>
                )} */}
    </div>
  );
};

export default Shirt;
