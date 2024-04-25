import { ReactNode, useEffect } from "react";
import styles from "./profile.module.css";
import Link from "next/link";

interface MenuProps {
  setIsOpen: (value: boolean) => void;
}

export const Menu = ({ setIsOpen }: MenuProps) => {
  return (
    <ModalOverlay onClose={() => setIsOpen(false)}>
      <div
        className={` ${styles.modal} bg-white rounded-lg shadow-xl m-4 max-w-md w-[400px]`}
      >
        <div className="flex flex-col p-6 gap-3">
          <div className="p-4 bg-slate-100   rounded-lg text-sm cursor-pointer hover:bg-slate-200">
            <div className="flex gap-3 justify-center items-center">
              <Link href="/account/profile">
                <p>User Profile</p>
              </Link>
            </div>
          </div>
          <div className="p-4 bg-slate-100   rounded-lg text-sm cursor-pointer hover:bg-slate-200">
            <div className="flex gap-3 justify-center items-center">
              <Link href="/account/alerts">
                <p>Alert Settings</p>
              </Link>
            </div>
          </div>
          <div className="p-4 bg-slate-100   rounded-lg text-sm cursor-pointer hover:bg-slate-200">
            <div className="flex gap-3 justify-center items-center">
              <Link href="/account/billing">
                <p>Plan & Billing</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

interface OverlayProps {
  onClose: () => void;
  children: ReactNode;
}

const ModalOverlay = ({ onClose, children }: OverlayProps) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className={styles.menu}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
};
