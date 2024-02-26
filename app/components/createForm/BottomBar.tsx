import React from "react";
import styles from "./form.module.css";
interface BottomBarProps {
  children: React.ReactNode;
}

const BottomBar = ({ children }: BottomBarProps) => {
  return (
    <div
      className={`${styles.bottombar} fixed bottom-0 left-0 border-t-[1px] border-emerald-900 bg-white w-full p-4 flex justify-end`}
    >
      {children}
    </div>
  );
};

export default BottomBar;
