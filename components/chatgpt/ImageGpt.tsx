"use client";
import RegularButton from "@/components/buttons/RegularButton";
import ProjectSelectForm from "@/components/createForm/ProjectSelectForm";
import { TooltipWithHelperIcon } from "@/components/tooltips/TooltipWithHelperIcon";
import { ReceiptStoreStage } from "@/constants/form";
import { ReceiptInput } from "@/types/form";

import { convertHeic } from "@/utils/media";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FormError } from "@/components/form-error";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Loading from "@/components/loading-components/Loading";
import FileUploadDropzone from "@/components/dropzone/FileUploadDropzone";
import { ProjectType } from "@/types/ProjectTypes";
import ManualDate from "@/components/createForm/FormPages/ManualDate";
import ReturnPolicySelect from "@/components/selects/ReturnPolicySelect";
import { Session } from "@/types/Session";
import SubscribeModal from "@/components/modals/SubscribeModal";

interface Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: ReceiptInput;
  setStage: (stage: any) => void;
  handleChange: any;
  // errors: any;
  validateForm: any;
  projects: ProjectType[];
  session: Session;
}

export default function ImageGpt({
  setFieldValue,
  values,
  setStage,
  handleChange,
  validateForm,
  projects,
  session,
}: Props) {
  const [image, setImage] = useState<string>("");

  const [prompt, setPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const [validationErrors, setValidationErrors] = useState({
    folderName: "",
  });
  const [projectPlanId, setProjectPlanId] = useState<number | null>(0);

  const OnlineGptCall = async () => {
    const res = await fetch("/api/gpt/analyze-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
        projectOwner: values.folderUserId,
        projectId: values.folder,
      }),
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      setErrors(errorMessage.error);
      setLoading(false);
      console.error("Failed to fetch data");

      return;
    }

    const data = await res.json();

    if (
      data.choices[0].message.content === "{'error':'This is not a receipt.'}"
    ) {
      setErrors(
        "The image you uploaded cannot be analyzed. Please ensure you upload a valid receipt, or try uploading a higher-quality image for better recognition."
      );
      setPrompt(false);
      setLoading(false);
      return;
    }

    const jsonObject = JSON.parse(data.choices[0].message.content);
    setFieldValue("items", jsonObject.receipt.items);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);

    // test gpt without api
    // const jsonObject = JSON.parse(data);
    // setFieldValue("amount", jsonObject.receipt.total_amount);
    // setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);
    // setFieldValue("receiptImage", image);

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
    setErrors("");
    setPrompt(false);
    setLoading(false);
  };

  const MemoGptCall = async () => {
    const res = await fetch("/api/gpt/analyze-memo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
        projectOwner: values.folderUserId,
        projectId: values.folder,
      }),
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      setErrors(errorMessage.error);
      setLoading(false);

      return;
    }

    const data = await res.json();

    if (
      data.choices[0].message.content === "{'error':'This is not a receipt.'}"
    ) {
      setErrors(
        "The image you uploaded cannot be analyzed. Please ensure you upload a valid receipt, or try uploading a higher-quality image for better recognition."
      );

      setPrompt(false);
      setLoading(false);
      return;
    }

    console.log(data.choices[0].message.content);

    const jsonObject = JSON.parse(data.choices[0].message.content);
    setFieldValue("items", jsonObject.receipt.items);
    setFieldValue("amount", jsonObject.receipt.total_amount);
    setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    setFieldValue("store", jsonObject.receipt.store);

    // test gpt without api
    // const jsonObject = JSON.parse(data);
    // setFieldValue("amount", jsonObject.receipt.total_amount);
    // setFieldValue("purchase_date", jsonObject.receipt.date_purchased);
    // setFieldValue("store", jsonObject.receipt.store);
    // setFieldValue("receiptImage", image);

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

    setErrors("");
    setPrompt(false);
    setLoading(false);
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
      setErrors("Please upload an image file");
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
          setErrors("");
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

  const [subscribeModal, setSubscribeModal] = useState(false);

  const handleSubmit = async () => {
    const error = await validateForm();
    if (
      (session.user.planId === 1 || session.user.planId === null) &&
      (projectPlanId === 1 || projectPlanId === null)
    ) {
      setSubscribeModal(true);
      return;
    }

    if (Object.keys(error).length > 0) {
      setValidationErrors(error);
      return;
    }
    if (!image) {
      setErrors("Please upload an image to analyze.");
      return;
    }

    if (values.receiptImage && values.items.length > 0 && prompt === false) {
      setPrompt(true);
      return;
    }

    if (prompt === true) {
      setLoading(true);
      if (values.memo) {
        MemoGptCall();
      } else {
        OnlineGptCall();
      }
      return;
    } else if (values.items.length === 0 && image) {
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

  const [isManual, setIsManual] = useState(false);
  const [help, setHelp] = useState(false);

  return (
    <div>
      <div className="flex flex-col gap-6 ">
        <div className="flex justify-between">
          <div className="flex gap-3 items-center">
            <h1 className="text-3xl text-orange-600">Analyze Image</h1>
            <TooltipWithHelperIcon
              placement="right-start"
              content='We use AI to analyze the receipt image you upload. Take a
                picture of the receipt and upload it. Then click the
                "Analyze Image". This will extract the receipt store, purchase date and receipt item information. Please only upload images of receipts.'
            />
          </div>
          <p className="text-xs text-orange-600" onClick={() => setHelp(!help)}>
            Help
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {help && (
            <p className="text-xs text-orange-600">
              Choose the project to save the receipt to.
            </p>
          )}
          <ProjectSelectForm
            handleChange={handleChange}
            projects={projects}
            setFieldValue={setFieldValue}
            values={values}
            setProjectPlanId={setProjectPlanId}
          />

          {validationErrors.folderName && (
            <p className="text-sm text-orange-900">
              {validationErrors.folderName}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <p className={` text-emerald-900 `}>Return Date Policy</p>

              <TooltipWithHelperIcon
                placement="right-start"
                content="Number of days until return. You can manually enter one or choose from your return store policy list"
              />
            </div>
            {help && (
              <p className="text-xs text-orange-600">
                Select or input a return date policy for the receipt.
              </p>
            )}

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
                <p className="text">Select Policy</p>
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
                <p className="text">Add Manually</p>
              </button>
            </div>
            {isManual ? (
              <ManualDate
                values={values}
                handleChange={handleChange}
                setFieldValue={setFieldValue}
                comingfrom="gpt"
              />
            ) : (
              <ReturnPolicySelect
                values={values}
                handleChange={handleChange}
                type={values.days_until_return}
                setFieldValue={setFieldValue}
                comingfrom="gpt"
              />
            )}
          </div>
          <div className="flex flex-col gap-3">
            <div className=" flex items-center gap-2 relative">
              <p className="text-emerald-900">Is this a memo?*</p>

              <TooltipWithHelperIcon
                content="Selecting the type of receipt you upload enables us to
                  accurately analyze and process it."
              />
            </div>
            {help && (
              <p className="text-xs text-orange-600">
                This will help analyze the image. If you skip this, the analysis
                might be wrong
              </p>
            )}

            <div className="flex gap-4 items-center">
              <label
                className={`flex gap-2 justify-center items-center px-4 py-2 rounded cursor-pointer ${
                  values.memo === true
                    ? "bg-emerald-900 text-white border-[1px] border-emerald-900 text-sm w-1/2"
                    : "bg text-emerald-900 border-[1px] border-emerald-900 text-sm w-1/2"
                }`}
              >
                <p className="">Yes</p>
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
                <span className="">No</span>
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
          <div>
            <div className="flex flex-col gap-5">
              {help && (
                <p className="text-xs text-orange-600">
                  Upload a photo of the receipt and press Analyze Image. We do
                  not support pdfs. Images accepted are .jpg, .jpeg, .png, .gif,
                  .bmp, .tiff, .heic. Please ensure the image is clear and that
                  there is no handwriting on the receipt.
                </p>
              )}
              <FileUploadDropzone
                onFileUpload={onFileUpload}
                button={
                  <div className="w-full h-[150px] soverflow-hidden  border-[1.5px] border-dashed border-emerald-900  focus:border-emerald-900 focus:outline-none rounded-lg  relative flex flex-col items-center justify-center cursor-pointer gap-5">
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
                  <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-lg border-[1px] border-emerald-900">
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

              <div className="w-full ">
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
                      loading
                        ? "text-white text-sm p-1"
                        : "text-emerald-900 text-sm p-1"
                    }
                  >
                    {loading ? "Analyzing..." : "Analyze Image"}
                  </p>
                </RegularButton>
              </div>
            </div>
          </div>
        </div>

        {prompt && (
          <div className="fixed inset-0 bg-black bg-opacity-10 z-[2000] flex justify-center items-center ">
            <div className="p-10 flex flex-col gap-4 mt-10 bg-orange-50 rounded-lg shadow-md items-center justify-center text-emerald-900 max-w-lg w-[400px]">
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
                    handleSubmit();
                    setPrompt(false);
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
        {/* {noReceipt && (
          <FormError
            message={`The image you uploaded cannot be analyzed. Please ensure you upload a valid receipt, or try uploading a higher-quality image for better recognition.`}
          ></FormError>
        )}
        {noImage && (
          <FormError
            message={
              "Please upload an image to analyze. If you have a receipt, take a picture of the receipt and upload it."
            }
          ></FormError>
        )}
        {invalidImage && (
          <FormError message={"Please upload a valid image file."}></FormError>
        )}
        {apiError && <FormError message={apiError}></FormError>}
        {loading && <Loading loading={loading} />}
        {subscribeModal && (
          <SubscribeModal
            // message="You have reached the limit of receipts you can analyze. Please upgrade to a premium plan to continue."
            message="Please upgrade plans to analyze receipts by photo"
            onClose={() => setSubscribeModal(false)}
          />
        )} */}
        {<FormError message={errors}></FormError>}
      </div>
    </div>
  );
}
