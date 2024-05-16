"use client";
import ProjectSelect from "@/components/createForm/ProjectSelectForm";
import styles from "@/app/create/upload.module.css";
import { ReceiptStoreStage } from "@/constants/form";
import { ProjectType } from "@/types/ProjectTypes";
import { calculateReturnDate, formatDateToMMDDYY } from "@/utils/Date";
import { convertHeic } from "@/utils/media";
import Image from "next/image";
import FileUploadDropzone from "@/components/dropzone/FileUploadDropzone";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ReturnPolicySelect from "@/components/select/ReturnPolicySelect";
import ManualDate from "@/components/createForm/FormPages/ManualDate";

interface ReceiptManualProps {
  values: any;
  handleChange: any;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors: any;
  online?: boolean;
  setStage?: (stage: ReceiptStoreStage) => void;
  projects: ProjectType[];
}

const ReceiptManual = ({
  values,
  handleChange,
  setFieldValue,
  errors,
  online = false,
  projects,
}: ReceiptManualProps) => {
  useEffect(() => {
    setFieldValue("folder", projects[0].id);
  }, [projects, setFieldValue]);
  const pathname = usePathname();

  const [isManual, setIsManual] = useState<boolean>(false);

  const onFileUpload = async (file: File) => {
    if (file === null) {
      return;
    }
    if (!file.type.match("image.*")) {
      alert("Please upload an image file");
      return;
    }
    if (file.type === "image/heic" || file.name.endsWith(".heic")) {
      try {
        file = await convertHeic(file);
      } catch (error) {
        console.error("Error converting HEIC file:", error);
        alert("Error converting HEIC file.");
        return;
      }
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        try {
          setFieldValue("receiptImage", reader.result);
        } catch (error) {
          console.error("Error handling file:", error);
          alert("Error processing file.");
        }
      }
    };
    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
    };
  };

  return (
    <div className="flex flex-col gap-10  w-full justify-center items-center mt-10">
      <div className=" max-w-[600px] w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl text-orange-600 mb-4">
            {pathname === "/create/manual" ? "Manual Entry" : "Analyze Text"}
          </h1>
        </div>

        <div className={styles.receiptContainer}>
          <div className={styles.receiptInputs}>
            <div className="w-full">
              <p className="text-sm text-emerald-900 ">Store name*</p>
              <input
                className="w-full border-[1px] bg  p-2  border-emerald-900 rounded  focus:outline-none"
                name="store"
                value={values.store}
                onChange={handleChange("store")}
              />
            </div>

            {errors.store && (
              <p className="text-orange-800 text-sm">{errors.store}</p>
            )}
            <ProjectSelect
              handleChange={handleChange}
              projects={projects}
              setFieldValue={setFieldValue}
              values={values}
              // errors={errors}
            />

            <div className="w-full">
              <p className="text-sm text-emerald-900 ">Card</p>
              <input
                className="w-full border-[1px] bg  p-2  border-emerald-900 rounded  focus:outline-none"
                name="card"
                value={values.card}
                onChange={handleChange("card")}
              />
            </div>

            {online && (
              <div className="w-full">
                <p className="text-sm text-emerald-900 ">
                  Tracking Number Link
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    className="w-full border-[1px] bg  p-2  border-emerald-900 rounded  focus:outline-none"
                    name="tracking_number"
                    value={values.tracking_number}
                    onChange={handleChange("tracking_number")}
                  />
                  {errors.tracking_number && (
                    <p className="text-orange-800 text-sm">
                      {errors.tracking_number}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <p className={` text-emerald-900 text-sm`}>Return Date Policy</p>
              <div className="w-full flex justify-between gap-2 mb-2">
                <button
                  type="button"
                  className={
                    isManual
                      ? "w-full border-[1px] bg  p-2  border-emerald-900 rounded text-sm text-emerald-900"
                      : "w-full border-[1px] bg-emerald-900  p-2  border-emerald-900 rounded text-sm text-white"
                  }
                  onClick={() => {
                    setIsManual(false);
                  }}
                >
                  Select Policy
                </button>
                <button
                  type="button"
                  className={
                    !isManual
                      ? "w-full border-[1px] bg  p-2  border-emerald-900 rounded text-sm text-emerald-900"
                      : "w-full border-[1px] bg-emerald-900  p-2  border-emerald-900 rounded text-sm text-white"
                  }
                  onClick={() => {
                    setIsManual(true);
                  }}
                >
                  Add Manually
                </button>
              </div>
              {isManual ? (
                <ManualDate
                  values={values}
                  handleChange={handleChange}
                  errors={errors}
                  setFieldValue={setFieldValue}
                />
              ) : (
                <ReturnPolicySelect
                  type={values.days_until_return}
                  setFieldValue={setFieldValue}
                />
              )}
            </div>
          </div>

          <div className={`w-full relative`}>
            <FileUploadDropzone
              onFileUpload={onFileUpload}
              button={
                <div className="w-full h-[100px] soverflow-hidden  border-[1.5px] border-dashed border-emerald-900  focus:border-emerald-900 focus:outline-none rounded-lg  relative flex flex-col items-center justify-center cursor-pointer gap-5">
                  <Image
                    src="/image_b.png"
                    alt=""
                    width={30}
                    height={30}
                    className="object-cover "
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <p className="text-xs text-emerald-900">
                    Upload photo or drag and drop
                  </p>
                </div>
              }
            />
          </div>
          {values.receiptImage && (
            <div className="relative w-24 h-24 ">
              <div className="w-24 h-24 overflow-hidden flex items-center justify-center  border-[1px] border-emerald-900 rounded">
                <button
                  type="button"
                  onClick={() => {
                    setFieldValue("receiptImage", "");
                  }}
                  className="absolute -top-2  -right-2 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                >
                  X
                </button>
                <Image
                  width={150}
                  height={150}
                  src={values.receiptImage}
                  alt=""
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptManual;
