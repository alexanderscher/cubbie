import React from "react";

interface BottomBarProps {
  children: React.ReactNode;
}

const BottomBar = ({ children }: BottomBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 border-t-[2px] border-emerald-900 bg-white w-full p-4 flex justify-end">
      {children}
    </div>
  );
};

export default BottomBar;
