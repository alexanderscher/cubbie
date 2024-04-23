"use client";

import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/components/buttons/RegularButton";
import { Formik } from "formik";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState, useTransition } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { EDIT_RECEIPT_SCHEMA } from "@/utils/editValidation";
import CurrencyInput from "react-currency-input-field";
import Loading from "@/components/Loading/Loading";
import ErrorModal from "@/components/error/ErrorModal";
import HeaderNav from "@/components/navbar/HeaderNav";
import ImageModal from "@/components/images/ImageModal";
import Item from "@/components/Item";
import { convertHeic } from "@/utils/media";
import { editReceipt } from "@/actions/receipts/editReceipt";
import { Item as ItemType, Receipt } from "@/types/AppTypes";
import { formatDateToYYYYMMDD } from "@/utils/Date";
import PurchaseTypeSelect from "@/components/select/PurchaseTypeSelect";
import { AddItem } from "@/components/item/AddItem";
import FileUploadDropzone from "@/components/dropzone/FileUploadDropzone";
import * as Yup from "yup";
import { toast } from "sonner";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
type ExtendedReceiptType = Receipt & {
  edit_image: string;
};

interface Props {
  receipt: ExtendedReceiptType;
}

const ReceiptIdEdit = ({ receipt }: Props) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const stringId = Array.isArray(id) ? id[0] : id;
  const [uploadError, setUploadError] = useState("");
  const [isClient, setIsClient] = useState(false);

  const [errorM, setErrorM] = useState({
    purchase_date: "",
    return_date: "",
    tracking_number: "",
    store: "",
  });
  const [openItemId, setOpenItemId] = useState(null as number | null);

  const [newItem, setNewItem] = useState({
    description: "",
    price: "0.00",
    barcode: "",
    character: "",
    photo: "",
    receipt_id: receipt.id,
  });

  const [error, setError] = useState({
    description: "",
    price: "",
    result: "",
  });

  const [isPending, startTransition] = useTransition();

  const itemSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleOpenItem = (
    itemId: number | undefined,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    if (itemId === undefined) return;

    if (openItemId === itemId) {
      setOpenItemId(null);
    } else {
      setOpenItemId(itemId);
    }
  };

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

  if (!receipt.items) return <div className="mi">Loading</div>;
  return (
    <Formik
      initialValues={{
        ...receipt,
      }}
      onSubmit={(values) => {
        startTransition(async () => {
          try {
            const result = await editReceipt({ id: stringId, values });
            if (result?.error) {
              setUploadError(result.error);
            } else {
              router.push(`/receipt/${id}`);
              toast.success("Your operation was successful!");
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
        <div className="flex flex-col gap-8  w-full h-full pb-[200px] max-w-[1260px]">
          <HeaderNav receipt={receipt} />
          <div className="flex justify-between items-center w-full">
            <div className="flex gap-2">
              {dirty ? (
                <div className="flex gap-2">
                  <RegularButton
                    styles="bg  border-emerald-900"
                    href={`/receipt/${id}`}
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
                  styles="bg border-emerald-900"
                  href={`/receipt/${id}`}
                >
                  <p className="text-emerald-900 text-xs">Cancel</p>
                </RegularButton>
              )}
            </div>
          </div>

          <div className={`${styles.receipt} `}>
            <div className={`${styles.receiptLeft}  flex flex-col gap-2 `}>
              <div className={` rounded  bg-white flex flex-col gap-4 p-8`}>
                {!values.receipt_image_url && !values.edit_image && (
                  <div className="w-full  overflow-hidden  relative">
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
                      <p className="text-orange-900 text-xs mt-2">
                        {errorM.store}
                      </p>
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
                      value={values.card}
                      onChange={handleChange("card")}
                      className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none rounded p-2"
                    />
                  </div>

                  <div className="w-full">
                    <p className="text-emerald-900 text-xs">Tracking Link</p>
                    <input
                      value={values.tracking_number}
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
              </div>
            </div>

            {receipt.items.length > 0 && (
              <div
                className={`flex flex-col gap-2 pb-[200px] ${styles.boxContainer}`}
              >
                <div className={`${styles.boxes} `}>
                  {isClient &&
                    receipt.items.map((item: ItemType, index: number) => (
                      <Item
                        key={item.id}
                        item={item}
                        isOpen={openItemId === item.id}
                        onToggleOpen={(e) => toggleOpenItem(item.id, e)}
                        setOpenItemId={setOpenItemId}
                      />
                    ))}
                </div>
              </div>
            )}
            {receipt.items.length === 0 && (
              <div className={`${styles.placeholder} shadow`}>
                <div className="w-full  flex justify-center items-center">
                  <Image
                    src="/item_b.png"
                    alt=""
                    width={60}
                    height={60}
                    className="object-cover "
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>

                <RegularButton
                  styles={
                    "bg-emerald-900 text-white text-xs w-1/2  border-emerald-900"
                  }
                  handleClick={() => {
                    setIsAddOpen(true);
                  }}
                >
                  Add Item
                </RegularButton>
              </div>
            )}
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

export default ReceiptIdEdit;
