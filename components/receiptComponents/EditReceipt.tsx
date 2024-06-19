"use client";
import { Formik } from "formik";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState, useTransition } from "react";
import { EDIT_RECEIPT_SCHEMA } from "@/utils/editValidation";
import Loading from "@/components/loading/Loading";
import ErrorModal from "@/components/modals/ErrorModal";
import ImageModal from "@/components/images/ImageModal";
import { convertHeic } from "@/utils/media";
import { editReceipt } from "@/actions/receipts/editReceipt";
import { formatDateToYYYYMMDD } from "@/utils/Date";
import PurchaseTypeSelect from "@/components/selects/PurchaseTypeSelect";
import { AddItem } from "@/components/item/AddItem";
import FileUploadDropzone from "@/components/dropzone/FileUploadDropzone";
import { toast } from "sonner";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import { ReceiptType } from "@/types/ReceiptTypes";
import { getReceiptByIdClient } from "@/lib/getReceiptsClient";
import { BeatLoader } from "react-spinners";
import RegularButton from "@/components/buttons/RegularButton";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
type ExtendedReceiptType = ReceiptType & {
  edit_image: string;
};

interface Props {
  receiptId: string;
  setEdit: (value: boolean) => void;
}

const EditReceipt = ({ receiptId, setEdit }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const stringId = Array.isArray(receiptId) ? receiptId[0] : receiptId;
  const [uploadError, setUploadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [receipt, setReceipt] = useState<ExtendedReceiptType>(
    {} as ExtendedReceiptType
  );
  const [isPending, startTransition] = useTransition();
  const { reloadReceipts } = useSearchReceiptContext();

  const [errorM, setErrorM] = useState({
    purchase_date: "",
    return_date: "",
    tracking_number: "",
    store: "",
  });

  const [newItem, setNewItem] = useState({
    description: "",
    price: "0.00",
    barcode: "",
    character: "",
    photo: "",
    receipt_id: receiptId,
  });

  const [error, setError] = useState({
    description: "",
    price: "",
    result: "",
  });

  useEffect(() => {
    const fetchReceipt = async () => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const receipt = await getReceiptByIdClient(receiptId, timezone);
      if (receipt) {
        setReceipt({ ...receipt, edit_image: "" });
      }
      setIsLoading(false);
    };

    fetchReceipt();
  }, [receiptId]);

  const onFileUpload = async (file: File, setFieldValue: any) => {
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
        setFieldValue("receipt_image_url", "");
        setFieldValue("edit_image", reader.result);
      }
    };
    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
    };
  };

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    if (e.target.files && e.target.files[0]) {
      let file = e.target.files[0];
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
          setFieldValue("receipt_image_url", "");
          setFieldValue("edit_image", reader.result);
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
    }
  };

  if (isLoading)
    return (
      <div className="h-[90vh] w-full flex items-center justify-center">
        <BeatLoader loading={isLoading} size={15} color={"rgb(6 78 59)"} />
      </div>
    );

  return (
    <Formik
      initialValues={{
        ...receipt,
      }}
      onSubmit={(values) => {
        startTransition(async () => {
          try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const valuesObj = {
              ...values,
              timezone: timezone,
            };

            const result = await editReceipt({
              id: stringId,
              values: valuesObj,
            });

            if (result?.error) {
              setUploadError(result.error);
            } else {
              toast.success("Receipt updated successfully.");
              reloadReceipts();
              setEdit(false);
            }
          } catch (e) {
            toast.error("An error occurred. Please try again.");
          }
        });
      }}
      validationSchema={EDIT_RECEIPT_SCHEMA}
    >
      {({
        handleSubmit,
        values,
        handleChange,
        validateForm,
        dirty,
        setFieldValue,
      }) => (
        <div className=" flex flex-col gap-4  w-full">
          <div className="flex justify-between items-center border-b  px-5 py-3 rounded-t-lg border-emerald-900 w-full">
            <h3 className="text-md text-emerald-900">Edit {receipt.store}</h3>
            <button
              type="button"
              className="text-emerald-900"
              onClick={(e) => {
                e.preventDefault();
                setEdit(false);
              }}
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          <div className="p-8 flex gap-4 flex-col">
            {!values.receipt_image_url && !values.edit_image && (
              <div className="w-full  overflow-hidden  relative ">
                <FileUploadDropzone
                  onFileUpload={(e) => onFileUpload(e, setFieldValue)}
                  button={
                    <div className="w-full h-[150px] soverflow-hidden  border-[1px] border-dashed border-emerald-900  focus:border-emerald-900 focus:outline-none rounded  relative flex flex-col items-center justify-center cursor-pointer gap-5">
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
              </div>
            )}
            {values.edit_image && (
              <div className="w-full flex justify-center items-center relative group">
                <div className="relative  w-[200px] max-h-[400px] rounded overflow-hidden">
                  <Image
                    src={values.edit_image}
                    width={300}
                    height={300}
                    alt="Receipt Image"
                    className="object-contain  w-full cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
                    layout="intrinsic"
                    onClick={() => setIsOpen(true)}
                  />
                  <ImageModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    imageUrl={values.edit_image}
                    altText="Your Image Description"
                    setFieldValue={setFieldValue}
                    handleFileChange={onFileUpload}
                    changeField="edit_image"
                  />
                </div>
              </div>
            )}

            {values.receipt_image_url && (
              <div className="w-full flex justify-center items-center relative">
                <div className="relative  w-[200px] max-h-[400px] rounded overflow-hidden hover:opacity-80 transition-all duration-300 ease-in-out">
                  <Image
                    src={values.receipt_image_url}
                    width={300}
                    height={300}
                    alt="Receipt Image"
                    className="object-contain rpunded-md w-full cursor-pointer"
                    layout="intrinsic"
                    onClick={() => setIsOpen(true)}
                  />
                </div>
                <ImageModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  imageUrl={values.receipt_image_url}
                  altText="Your Image Description"
                  setFieldValue={setFieldValue}
                  handleFileChange={handleFileChange}
                  changeField="receipt_image_url"
                />
              </div>
            )}

            <div className="flex flex-col gap-4 text-sm">
              <div className="w-full">
                <p className="text-emerald-900 text-xs">Store Name</p>
                <input
                  value={values.store}
                  onChange={handleChange("store")}
                  className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none rounded p-2"
                />
                {errorM.store && (
                  <p className="text-orange-900 text-xs mt-2">{errorM.store}</p>
                )}
              </div>
              <PurchaseTypeSelect
                type={values.type}
                setFieldValue={setFieldValue}
                color="white"
              />

              <div className="w-full ">
                <p className="text-emerald-900 text-xs">Purcahse Date</p>
                <input
                  type="date"
                  style={{ WebkitAppearance: "none" }}
                  value={formatDateToYYYYMMDD(values.purchase_date)}
                  onChange={handleChange("purchase_date")}
                  className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none rounded p-2 bg-white"
                />
                {errorM.purchase_date && (
                  <p className="text-orange-900 text-xs mt-2">
                    {errorM.purchase_date}
                  </p>
                )}
              </div>

              <div className="w-full">
                <p className="text-emerald-900 text-xs">Return Date</p>
                <input
                  type="date"
                  style={{ WebkitAppearance: "none" }}
                  value={formatDateToYYYYMMDD(values.return_date)}
                  onChange={handleChange("return_date")}
                  className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none rounded p-2 bg-white"
                />
                {errorM.return_date && (
                  <p className="text-orange-900 text-xs mt-2">
                    {errorM.return_date}
                  </p>
                )}
              </div>

              <div className="w-full">
                <p className="text-emerald-900 text-xs">Card Used</p>
                <input
                  value={values.card || ""}
                  onChange={handleChange("card")}
                  className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none rounded p-2"
                />
              </div>

              <div className="w-full">
                <p className="text-emerald-900 text-xs">Tracking Link</p>
                <input
                  value={values.tracking_number || ""}
                  onChange={handleChange("tracking_number")}
                  className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none rounded p-2"
                />
                {errorM.tracking_number && (
                  <p className="text-orange-900 text-xs mt-2">
                    {errorM.tracking_number}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              {dirty ? (
                <div className="flex w-full justify-between">
                  <RegularButton
                    styles="border-emerald-900"
                    href={`/receipt/${receiptId}`}
                  >
                    <p className="text-emerald-900 text-xs">Discard</p>
                  </RegularButton>
                  <RegularButton
                    styles="bg-emerald-900  border-emerald-900"
                    handleClick={async () => {
                      const error = await validateForm();
                      if (error) {
                        setErrorM({
                          store: (error.store as string) || "",
                          purchase_date: (error.purchase_date as string) || "",
                          return_date: (error.return_date as string) || "",
                          tracking_number: error.tracking_number || "",
                        });
                      }
                      if (Object.keys(error).length === 0) {
                        handleSubmit();
                      }
                    }}
                  >
                    <p className="text-white text-xs">Save</p>
                  </RegularButton>
                </div>
              ) : (
                <RegularButton
                  styles=" border-emerald-900"
                  href={`/receipt/${receiptId}`}
                >
                  <p className="text-emerald-900 text-xs">Cancel</p>
                </RegularButton>
              )}
            </div>
          </div>

          {uploadError && (
            <ErrorModal
              errorMessage={uploadError}
              onClose={() => setUploadError("")}
            />
          )}
          {isAddOpen && (
            <ModalOverlay onClose={() => setIsAddOpen(false)}>
              <AddItem
                setIsAddOpen={setIsAddOpen}
                handleSubmit={handleSubmit}
                setNewItem={setNewItem}
                newItem={newItem}
                error={error}
                isPending={isPending}
              />
            </ModalOverlay>
          )}
          {isPending && <Loading loading={isPending} />}
        </div>
      )}
    </Formik>
  );
};

export default EditReceipt;
