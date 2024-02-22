import React from "react";
import styles from "./ImageModal.module.css"; // Make sure you have the corresponding CSS module
import Image from "next/image";

interface ImageModalProps {
  imageUrl: string;
  altText: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageModal = ({
  imageUrl,
  altText,
  isOpen,
  setIsOpen,
}: ImageModalProps) => {
  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.modal}>
            <Image
              src={imageUrl}
              alt={altText}
              layout="responsive"
              width={300} // Width of the container
              height={400} // Height of the container
              objectFit="contain"
              className={styles.fullImage}
            />
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeButton}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;
