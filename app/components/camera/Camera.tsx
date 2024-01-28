"use client";
import React, { useState, useCallback, useRef } from "react";
import Webcam from "react-webcam";

interface Props {
  setImage: (image: string) => void;
  setShowModal: (showModal: boolean) => void;
}

const Camera = ({ setImage, setShowModal }: Props) => {
  const webcamRef = useRef<Webcam>(null);

  const [tempImage, setTempImage] = useState<null | string>(null);
  const [useFrontCamera, setUseFrontCamera] = useState(true);

  const videoConstraints = {
    facingMode: useFrontCamera ? "user" : "environment",
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setTempImage(imageSrc);
    } else {
      console.error("Webcam is not ready");
    }
  }, [webcamRef]);

  return (
    <div>
      {tempImage ? (
        <div>
          <img src={tempImage} alt="Captured" />
          <button onClick={() => setTempImage(null)}>Retake Image</button>
          <button
            onClick={() => {
              setImage(tempImage);
              setShowModal(false);
            }}
          >
            Save Image
          </button>
        </div>
      ) : (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: "100%" }}
          />
          <button onClick={captureImage}>Capture Image</button>
          <button onClick={() => setUseFrontCamera(!useFrontCamera)}>
            Switch Camera
          </button>
        </div>
      )}
    </div>
  );
};

export default Camera;
