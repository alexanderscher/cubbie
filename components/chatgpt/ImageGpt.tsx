"use client";
import RegularButton from "@/components/buttons/RegularButton";
import ProjectSelectForm from "@/components/createForm/ProjectSelectForm";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import { ReceiptStoreStage } from "@/constants/form";
import { ReceiptInput } from "@/types/form";
import { Project } from "@/types/AppTypes";
import { convertHeic } from "@/utils/media";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, use } from "react";
import { FormError } from "@/components/form-error";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Loading from "@/components/Loading";
import FileUploadDropzone from "@/components/dropzone/FileUploadDropzone";

interface Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: ReceiptInput;
  setStage: (stage: any) => void;
  handleChange: any;
  errors: any;
  validateForm: any;
  projects: Project[];
}

export default function ImageGpt({
  setFieldValue,
  values,
  setStage,
  handleChange,
  errors,
  validateForm,
  projects,
}: Props) {
  const [image, setImage] = useState<string>("");
  const [noImage, setNoImage] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noReceipt, setNoReceipt] = useState(false);
  const [invalidImage, setInvalidImage] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    folderName: "",
  });

  const OnlineGptCall = async () => {
    const res = await fetch("/api/gpt/analyze-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
      }),
    });

    if (!res.ok) {
      setApiError(true);
      setLoading(false);
      console.error("Failed to fetch data");

      return;
    }

    const data = await res.json();

    // if (data.choices[0].message.content === "This is not a receipt.") {
    //   setNoReceipt(true);
    //   setNoImage(false);
    //   setPrompt(false);
    //   setLoading(false);
    //   return;
    // }

    // const jsonObject = JSON.parse(data.choices[0].message.content);
    // setFieldValue("items", jsonObject.receipt.items);
    // setFieldValue("amount", jsonObject.receipt.total_amount);
    // setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);

    const jsonObject = JSON.parse(data);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);
    setFieldValue("receiptImage", image);

    const itemsWithAllProperties = jsonObject.receipt.items.map(
      (item: any) => ({
        description: item.description || "",
        photo: item.photo || "",
        price: item.price || 0,
        barcode: item.barcode || "",
        character: "",
      })
    );
    setFieldValue("items", itemsWithAllProperties);
    setStage(ReceiptStoreStage.PREVIEW);
    setNoImage(false);
    setPrompt(false);
    setLoading(false);
    setNoReceipt(false);
    setApiError(false);
  };

  const MemoGptCall = async () => {
    const res = await fetch("/api/gpt/analyze-memo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
      }),
    });

    if (!res.ok) {
      setApiError(true);
      setLoading(false);

      return;
    }

    const data = await res.json();

    // if (data.choices[0].message.content === "This is not a receipt.") {
    //   setNoreceipt(true);
    //   setNoImage(false);
    //   setPrompt(false);
    //   setLoading(false);
    //   return;
    // }

    // console.log(data.choices[0].message.content);

    // const jsonObject = JSON.parse(data.choices[0].message.content);
    // setFieldValue("items", jsonObject.receipt.items);
    // setFieldValue("amount", jsonObject.receipt.total_amount);
    // setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);

    const jsonObject = JSON.parse(data);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);
    setFieldValue("receiptImage", image);
    const itemsWithAllProperties = jsonObject.receipt.items.map(
      (item: any) => ({
        description: item.description || "",
        photo: item.photo || "",
        price: item.price || 0,
        barcode: item.barcode || "",
        product_id: item.product_id || "",
        character: "",
      })
    );
    setFieldValue("items", itemsWithAllProperties);
    setStage(ReceiptStoreStage.PREVIEW);

    setNoImage(false);
    setPrompt(false);
    setLoading(false);
    setNoReceipt(false);
    setApiError(false);
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject("Error reading file");
      reader.readAsDataURL(file);
    });
  };

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
    reader.onload = async () => {
      if (typeof reader.result === "string") {
        try {
          const dataUrl = await readFileAsDataURL(file);
          setImage(dataUrl);
          setNoImage(false);
          setInvalidImage(false);
          setFieldValue("receiptImage", dataUrl);
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

  // const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files === null) {
  //     return;
  //   }

  //   let file = event.target.files[0];

  //   if (!file.type.match("image.*")) {
  //     alert("File is not an image.");
  //     setInvalidImage(true);
  //     return;
  //   }
  //   if (file.type === "image/heic" || file.name.endsWith(".heic")) {
  //     try {
  //       file = await convertHeic(file);
  //     } catch (error) {
  //       console.error("Error converting HEIC file:", error);
  //       alert("Error converting HEIC file.");
  //       return;
  //     }
  //   }

  //   try {
  //     const dataUrl = await readFileAsDataURL(file);
  //     setImage(dataUrl);
  //     setNoImage(false);
  //     setInvalidImage(false);
  //     setFieldValue("receiptImage", dataUrl);
  //   } catch (error) {
  //     console.error("Error handling file:", error);
  //     alert("Error processing file.");
  //   }

  //   [setFieldValue];
  // };

  const handleSubmit = async () => {
    const error = await validateForm();

    if (Object.keys(error).length > 0) {
      setValidationErrors(error);
      return;
    }
    if (!image) {
      console.log("no image");
      setNoImage(true);
      return;
    }

    if (values.receiptImage && values.items.length > 0) {
      setPrompt(true);
      return;
    }

    if (values.items.length === 0 && image) {
      setLoading(true);
      if (values.memo) {
        MemoGptCall();
      } else {
        OnlineGptCall();
      }
      return;
    }

    setPrompt(true);
  };

  const pathname = usePathname();

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl text-orange-600">Analyze Image</h1>
        <ProjectSelectForm
          handleChange={handleChange}
          projects={projects}
          setFieldValue={setFieldValue}
          values={values}
          errors={errors}
        />
        {validationErrors.folderName && (
          <p className="text-sm text-orange-900">
            {validationErrors.folderName}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <div className=" flex items-center gap-2 relative">
            <p className="text-emerald-900">Is this a memo?*</p>
            <TooltipWithHelperIcon
              content="Selecting the type of receipt you upload enables us to
                  accurately analyze and process it."
            />
          </div>

          <div className="flex gap-4 items-center">
            <label
              className={`flex gap-2 justify-center items-center px-4 py-2 rounded cursor-pointer ${
                values.memo === true
                  ? "bg-emerald-900 text-white border-[1px] border-emerald-900 text-sm w-1/2"
                  : "bg text-emerald-900 border-[1px] border-emerald-900 text-sm w-1/2"
              }`}
            >
              <span>Yes</span>
              <input
                className="opacity-0 absolute"
                name="memo"
                type="radio"
                value="true"
                checked={values.memo === true}
                onChange={() => setFieldValue("memo", true)}
              />
            </label>
            <label
              className={`flex gap-2 justify-center items-center px-4 py-2 rounded cursor-pointer ${
                values.memo === false
                  ? "bg-emerald-900 text-white border-emerald-900 text-sm w-1/2"
                  : "bg text-emerald-900 border-[1px] border-emerald-900 text-sm w-1/2"
              }`}
            >
              <span>No</span>
              <input
                className="opacity-0 absolute"
                name="memo"
                type="radio"
                value="false"
                checked={values.memo === false}
                onChange={() => setFieldValue("memo", false)}
              />
            </label>
          </div>
        </div>
        <TooltipWithHelperIcon
          placement="right-start"
          content='We use AI to analyze the receipt image you upload. Take a
                picture of the receipt and upload it. Then click the
                "Analyze Image" button to get the receipt information
                and items. Please only upload images of receipts.'
        />

        <div>
          <div className="flex flex-col gap-5">
            <FileUploadDropzone
              onFileUpload={onFileUpload}
              button={
                <div className="w-full h-[150px] soverflow-hidden  border-[1.5px] border-dashed border-emerald-900  focus:border-emerald-900 focus:outline-none rounded-md  relative flex flex-col items-center justify-center cursor-pointer gap-5">
                  <Image
                    src="/image_b.png"
                    alt=""
                    width={40}
                    height={40}
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

            {image && (
              <div className="relative w-24 h-24 ">
                <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-md border-[1px] border-emerald-900">
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue("receiptImage", ""), setImage("");
                    }}
                    className="absolute -top-2  -right-2 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                  >
                    X
                  </button>
                  <Image width={150} height={150} src={image} alt="" />
                </div>
              </div>
            )}

            <div className="w-full">
              <RegularButton
                styles={`${
                  loading
                    ? "border-emerald-900 bg-emerald-900"
                    : "border-emerald-900 bg"
                }  w-full mt-2`}
                handleClick={() => {
                  handleSubmit();
                }}
              >
                <p
                  className={
                    loading ? "text-white text-sm" : "text-emerald-900 text-sm"
                  }
                >
                  {loading ? "Analyzing..." : "Analyze Image"}
                </p>
              </RegularButton>
            </div>
          </div>
        </div>

        {prompt && (
          <div className="fixed inset-0 bg-black bg-opacity-10 z-[2000] flex justify-center items-center">
            <div className="p-10 flex flex-col gap-4 mt-10 bg-orange-50 rounded-md shadow-md items-center justify-center text-emerald-900 max-w-lg w-[400px]">
              <div className="bg-orange-100 rounded-full flex items-center justify-center h-[50px] w-[50px]">
                <ExclamationTriangleIcon className=" text-orange-600 w-3/4 h-1/2" />
              </div>
              <p className="text-sm text-center text-orange-600 ">
                Are you sure you want to analyze the image? This will overwrite
                your current data.
              </p>
              <div className="flex flex-col gap-2 w-full">
                <RegularButton
                  styles="bg-orange-50 border-orange-600 text-orange-600  w-full"
                  handleClick={() => {
                    pathname === "/create/memo"
                      ? MemoGptCall()
                      : OnlineGptCall();
                    setPrompt(false); // Close modal after action
                  }}
                >
                  <p className="text-xs">Yes, anaylze.</p>
                </RegularButton>
                <RegularButton
                  styles="bg-orange-50 border-orange-600 text-orange-600  w-full"
                  handleClick={() => setPrompt(false)}
                >
                  <p className="text-xs">No, cancel.</p>
                </RegularButton>
              </div>
            </div>
          </div>
        )}
        {noReceipt && (
          <p className="text-sm text-center text-orange-800">
            The image you&apos;ve uploaded doesn&apos;t seem to be a receipt.
            Please ensure you upload a valid receipt, or try uploading a
            higher-quality image for better recognition.
          </p>
        )}
        {noImage && (
          <FormError
            message={
              "Please upload an image to analyze. If you have a receipt, take a picture of the receipt and upload it."
            }
          ></FormError>
        )}
        {invalidImage && (
          <FormError message={" Please upload a valid image file."}></FormError>
        )}
        {apiError && (
          <p className="text-sm text-center text-orange-800">
            There was an error analyzing the image. Please try again.
          </p>
        )}
        {loading && <Loading loading={loading} />}
      </div>
    </div>
  );
}
