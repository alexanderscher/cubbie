import Image from "next/image";
import React from "react";

const Shirt = () => {
  return (
    <div className="w-full h-[100px] overflow-hidden relative flex justify-center items-center">
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src="/clothes.png"
          alt=""
          width={50}
          height={50}
          className="object-cover "
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );
};

export default Shirt;
