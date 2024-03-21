import React from "react";
import styles from "./ImageModal.module.css"; // Make sure you have the corresponding CSS module
import Image from "next/image";

interface ImageModalProps {
  imageUrl: string;
  altText: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFieldValue?: any;
  handleFileChange?: any;
  changeField?: any;
}

const ImageModal = ({
  imageUrl,
  altText,
  isOpen,
  setIsOpen,
  setFieldValue,
  handleFileChange,
  changeField,
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
            {setFieldValue && handleFileChange && changeField && (
              <div className="">
                <button
                  className="absolute text-white top-0 left-0 m-2"
                  onClick={() => {
                    setFieldValue(changeField, "");
                  }}
                >
                  Remove
                </button>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                  id="replace"
                  style={{
                    opacity: 0,
                    position: "absolute",
                    zIndex: -1,
                  }}
                />
                <label
                  htmlFor="replace"
                  className="absolute text-white top-0 right-0 m-2"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Replace
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;
