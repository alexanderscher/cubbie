"use client";
import React, { useState } from "react";

interface Props {
  name: string;
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  styles?: string;
  type?: string;
}

const FormikInput = ({
  name,
  value,
  onChange,
  styles,
  type = "text",
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`w-full ${isFocused ? "input-focused" : ""}`}>
      <p
        className={`text-xs ${
          isFocused ? "text-emerald-900" : "text-slate-400"
        }`}
      >
        {name}
      </p>
      <input
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)} // Set isFocused to true when the input is focused
        onBlur={() => setIsFocused(false)} // Set isFocused to false when the input loses focus
        className={`focus:outline-none focus:border-emerald-900 text-xs w-full border-[1px] border-slate-400  p-2 cursor-pointer ${styles}`}
        type={type}
      />
    </div>
  );
};

export default FormikInput;
