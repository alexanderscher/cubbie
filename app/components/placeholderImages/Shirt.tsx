import Image from "next/image";
import React from "react";

const Shirt = () => {
  return (
    <div className="w-full h-[110px] overflow-hidden relative flex justify-center items-center">
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src="/item_b.png"
          alt=""
          width={80}
          height={80}
          className="object-cover "
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );
};

export default Shirt;
