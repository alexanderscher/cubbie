"use client";
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { useZxing } from "@/utils/useZxing";

type BarcodeScannerProps = {
  onResult: (result: any) => void;
  onError: (error: any) => void;
};

export const BarcodeScanner = ({
  onResult = () => {},
  onError = () => {},
}: BarcodeScannerProps) => {
  const webcamRef = useRef<Webcam>(null);

  const zxingRef = useZxing({ onResult, onError }).ref;

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
      />
      <video ref={zxingRef} style={{ display: "none" }}></video>{" "}
    </div>
  );
};
