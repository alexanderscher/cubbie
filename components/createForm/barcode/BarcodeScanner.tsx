import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import styles from "./barcode.module.css";
import { useZxing } from "@/utils/useZxing";

type BarcodeScannerProps = {
  onResult: (result: any) => void;
  onError: (error: any) => void;
  setShowScanner: (show: boolean) => void;
};

export const BarcodeScanner = ({
  onResult = () => {},
  onError = () => {},
  setShowScanner,
}: BarcodeScannerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const webcamRef = useRef<Webcam>(null);

  const handleBarcodeDetected = (result: any) => {
    setShowScanner(false);
    onResult(result);
  };

  const zxingRef = useZxing({ onResult: handleBarcodeDetected, onError }).ref;

  return (
    isModalOpen && (
      <div className={`${styles.modalStyle}`}>
        <button
          type="button"
          className={`${styles.closeButtonStyle}`}
          onClick={() => {
            setIsModalOpen(false);
            setShowScanner(false);
          }}
        >
          Close
        </button>
        <div className={`${styles.scannerStyle}`}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
          />
          <div
            style={{ transform: "translate(-50%, -50%)" }}
            className="absolute border-[3px] w-[300px] h-[200px] left-[50%] top-[50%] rounded-md "
          ></div>
          <video ref={zxingRef} style={{ display: "none" }}></video>
        </div>
      </div>
    )
  );
};
