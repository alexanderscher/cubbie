import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
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
      <div className="modal-style">
        <button
          type="button"
          className="close-button-style"
          onClick={() => {
            setIsModalOpen(false);
            setShowScanner(false);
          }}
        >
          Close
        </button>
        <div className="scanner-style">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
          />
          <div className="box-style"></div>
          <video ref={zxingRef} style={{ display: "none" }}></video>
        </div>
      </div>
    )
  );
};
