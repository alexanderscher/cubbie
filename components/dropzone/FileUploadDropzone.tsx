import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadDropzoneProps {
  onFileUpload: (file: File) => void;
}

const FileUploadDropzone = ({ onFileUpload }: FileUploadDropzoneProps) => {
  const [previewSrc, setPreviewSrc] = useState("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);

      onFileUpload(file);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="dropzone">
      <input {...getInputProps()} />
      <p>Drag drop an image here, or click to select an image</p>
    </div>
  );
};

export default FileUploadDropzone;
