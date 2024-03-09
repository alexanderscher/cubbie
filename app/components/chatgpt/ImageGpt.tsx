"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import ProjectSelect from "@/app/components/createForm/ProjectSelect";
import { ReceiptStoreStage } from "@/constants/form";
import { ReceiptInput } from "@/types/form";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChangeEvent, useState, useCallback, useRef, useEffect } from "react";
import heic2any from "heic2any";

interface Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: ReceiptInput;
  setStage: (stage: any) => void;
  handleChange: any;
  errors: any;
  validateForm: any;
}

export default function ImageGpt({
  setFieldValue,
  values,
  setStage,
  handleChange,
  errors,
  validateForm,
}: Props) {
  const pathname = usePathname();
  const [image, setImage] = useState<string>("");
  const [noImage, setNoImage] = useState(false);
  const [prompt, setPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noReceipt, setNoReceipt] = useState(false);
  const [invalidImage, setInvalidImage] = useState(false);
  const [apiError, setApiError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [projects, setProjects] = useState([]);

  const [validationErrors, setValidationErrors] = useState({
    folderName: "",
  });

  const [help, setHelp] = useState(false);
  const [memoHelp, setMemoHelp] = useState(false);

  useEffect(() => {
    const getProjects = async () => {
      const response = await fetch("/api/project");
      const data = await response.json();

      setProjects(data.projects);
    };
    getProjects();
  }, []);

  const handleContainerClick = () => {
    if (fileInputRef.current !== null) {
      fileInputRef.current.click();
    }
  };

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
    console.log("MemoGptCall");
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

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setNoImage(true);
      return;
    }

    let file = files[0];

    if (!file.type.match("image.*")) {
      alert("File is not an image.");
      setInvalidImage(true);
      return;
    }

    try {
      if (file.type === "image/heic" || file.type === "image/heif") {
        const convertedBlob = (await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.8,
        })) as Blob;
        file = new File([convertedBlob], "converted-image.jpeg", {
          type: "image/jpeg",
        });
      }

      const dataUrl = await readFileAsDataURL(file);
      setImage(dataUrl);
      setNoImage(false);
      setInvalidImage(false);
      setFieldValue("receiptImage", dataUrl);
    } catch (error) {
      console.error("Error handling file:", error);
      alert("Error processing file.");
    }

    [setFieldValue];
  };
  const handleSubmit = async () => {
    const error = await validateForm();
    console.log(error);

    if (error) {
      setValidationErrors(error);
    }

    if (!image) {
      setNoImage(true);
      return;
    }

    if (values.items.length === 0) {
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

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <div className=" flex gap-2 items-center">
            <p className=" text-slate-400">Is this a memo?*</p>
            <button
              type="button"
              className="w-[20px] h-[20px] border-[1px] border-orange-600 text-orange-600 rounded-md text-xs"
              onClick={() => setMemoHelp(!memoHelp)}
            >
              ?
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex gap-2 justify-center items-center">
              <span>Yes</span>
              <input
                name="memo"
                type="radio"
                value="true"
                checked={values.memo === true}
                onChange={() => setFieldValue("memo", true)}
              />
            </div>
            <div className="flex gap-2 justify-center items-center">
              <span>No</span>
              <input
                name="memo"
                type="radio"
                value="false"
                checked={values.memo === false}
                onChange={() => setFieldValue("memo", false)}
              />
            </div>
          </div>
        </div>

        {memoHelp && (
          <p className="text-sm text-center text-orange-600">
            Selecting the type of receipt you upload enables us to accurately
            analyze and process it.
          </p>
        )}
        <ProjectSelect
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
        <button
          type="button"
          className="w-[20px] h-[20px] border-[1px] border-orange-600 text-orange-600 rounded-md text-xs"
          onClick={() => setHelp(!help)}
        >
          ?
        </button>
        {help && (
          <p className="text-sm text-center text-orange-600">
            We use AI to analyze the receipt image you upload. Take a picture of
            the receipt and upload it. Then click the &quot;Analyze Image&quot;
            button to get the receipt information and items. Please only upload
            images of receipts.
          </p>
        )}

        <div>
          <div className="flex flex-col gap-5">
            <div
              className={` border-[1px] border-emerald-900 w-full flex flex-col gap-4 justify-center items-center rounded-md relative h-[200px] `}
              onClick={handleContainerClick}
              style={{ cursor: "pointer" }}
            >
              <input
                type="file"
                onChange={handleFileChange}
                id="file-upload"
                style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                ref={fileInputRef}
              />
              <Image
                src="/image_b.png"
                alt=""
                width={30}
                height={30}
                className="object-cover pt-4"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
              <label
                htmlFor="file-upload"
                className="justify-center items-center cursor-pointer text-sm"
              >
                Upload file
              </label>
            </div>

            {values.receiptImage && (
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
                  <Image
                    width={150}
                    height={150}
                    src={values.receiptImage}
                    alt=""
                  />
                </div>
              </div>
            )}

            <div className="w-full">
              <RegularButton
                styles="border-emerald-900 bg w-full "
                handleClick={() => {
                  !loading && handleSubmit();
                }}
              >
                <p className="text-emerald-900 ">
                  {" "}
                  {loading ? "Analyzing..." : "Analyze Image"}
                </p>
              </RegularButton>
            </div>
          </div>
        </div>

        {prompt && (
          <div className="flex flex-col gap-4 mt-10">
            <p className="text-sm text-center text-black">
              Are you sure you want to anaylze? This will overwrite your current
              items
            </p>
            <div className="flex gap-2">
              <RegularButton
                styles={"bg border-black w-full"}
                handleClick={() => {
                  pathname === "/receipt-type/memo"
                    ? MemoGptCall()
                    : OnlineGptCall();
                }}
              >
                <p className="text-sm">Confirm</p>
              </RegularButton>
              <RegularButton
                styles={"bg border-black w-full"}
                handleClick={() => setPrompt(false)}
              >
                <p className="text-sm">Cancel</p>
              </RegularButton>
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
          <p className="text-sm text-center text-orange-800">
            Please upload an image to analyze. If you have a receipt, take a
            picture of the receipt and upload it.
          </p>
        )}
        {invalidImage && (
          <p className="text-sm text-center text-orange-800">
            Please upload a valid image file.
          </p>
        )}
        {apiError && (
          <p className="text-sm text-center text-orange-800">
            There was an error analyzing the image. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
