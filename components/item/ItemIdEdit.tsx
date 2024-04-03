"use client";
import { useParams, useRouter } from "next/navigation";
import { ExtendedItemType } from "@/types/AppTypes";
import React, { ChangeEvent, useState, useTransition } from "react";
import RegularButton from "@/components/buttons/RegularButton";
import Image from "next/image";
import { Formik } from "formik";
import { EDIT_ITEM_SCHEMA } from "@/utils/editValidation";
import CurrencyInput from "react-currency-input-field";
import ErrorModal from "@/components/error/Modal";
import Loading from "@/components/Loading";
import HeaderItemNav from "@/components/navbar/HeaderItemNav";
import { BarcodeScanner } from "@/components/createForm/barcode/BarcodeScanner";
import ImageModal from "@/components/images/ImageModal";
import { convertHeic } from "@/utils/media";
import { editItem } from "@/actions/items/editItem";
import { FormError } from "@/components/form-error";
import FileUploadDropzone from "@/components/dropzone/FileUploadDropzone";

interface ItemIdEditProps {
  item: ExtendedItemType;
  id: string;
}

const ItemIdEdit = ({ item, id }: ItemIdEditProps) => {
  const router = useRouter();
  const [uploadError, setUploadError] = useState("");
  const [errorM, setErrorM] = useState({
    price: "",
    description: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isPending, startTransition] = useTransition();

  const onFileUpload = async (file: File, setFieldValue: any) => {
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
          setFieldValue("photo_url", "");
          setFieldValue("edit_image", reader.result);
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

  // const handleFileChange = async (
  //   e: ChangeEvent<HTMLInputElement>,
  //   setFieldValue: any
  // ) => {
  //   if (e.target.files && e.target.files[0]) {
  //     let file = e.target.files[0];
  //     if (!file.type.match("image.*")) {
  //       alert("Please upload an image file");

  //       return;
  //     }
  //     if (file.type === "image/heic" || file.name.endsWith(".heic")) {
  //       try {
  //         file = await convertHeic(file);
  //       } catch (error) {
  //         console.error("Error converting HEIC file:", error);
  //         alert("Error converting HEIC file.");
  //         return;
  //       }
  //     }

  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => {
  //       if (typeof reader.result === "string") {
  //         setFieldValue("photo_url", "");
  //         setFieldValue("edit_image", reader.result);
  //       }
  //     };
  //     reader.onerror = (error) => {
  //       console.error("Error converting file to base64:", error);
  //     };
  //   }
  // };

  if (!item.receipt) return <div className="min-h-screen">Loading</div>;
  return (
    <Formik
      initialValues={{
        ...item,
      }}
      onSubmit={(values) => {
        startTransition(async () => {
          const result = await editItem(id, values);

          if (result?.error) {
            setUploadError(result.error);
          } else {
            router.push(`/item/${id}`);
          }
        });
      }}
      validationSchema={EDIT_ITEM_SCHEMA}
    >
      {({
        handleSubmit,
        values,
        handleChange,
        validateForm,
        dirty,
        setFieldValue,
      }) => (
        <div className="w-full flex justify-center items-center">
          <div className="flex flex-col gap-6  max-w-[600px] w-full ">
            <HeaderItemNav item={item} />
            <div className="flex justify-between items-center">
              <div className="flex justify-between ">
                {dirty ? (
                  <div className="flex gap-2">
                    <RegularButton
                      styles="bg  border-emerald-900 focus:border-emerald-900 focus:outline-none"
                      href={`/item/${id}`}
                    >
                      <p className="text-emerald-900 text-xs">Discard</p>
                    </RegularButton>
                    <RegularButton
                      styles="bg-emerald-900  border-emerald-900 focus:border-emerald-900 focus:outline-none"
                      handleClick={async () => {
                        const error = await validateForm();
                        if (error) {
                          setErrorM({
                            price: error.price ? error.price : "",
                            description: error.description
                              ? error.description
                              : "",
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
                    href={`/item/${id}`}
                  >
                    <p className="text-emerald-900 text-xs">Cancel</p>
                  </RegularButton>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-col gap-4">
                {!values.photo_url && !values.edit_image && (
                  <FileUploadDropzone
                    onFileUpload={(e) => {
                      onFileUpload(e, setFieldValue);
                    }}
                    button={
                      <div className="w-full h-[150px] soverflow-hidden  border-[1.5px] border-dashed border-emerald-900  focus:border-emerald-900 focus:outline-none rounded-md  relative flex flex-col items-center justify-center cursor-pointer gap-5">
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
                )}
                {values.edit_image && (
                  <div className="w-full flex justify-center items-center relative group">
                    <div className="relative  w-[200px] max-h-[400px] rounded-md overflow-hidden">
                      <Image
                        src={values.edit_image}
                        width={300}
                        height={300}
                        alt="Receipt Image"
                        className="object-contain rounded-md w-full cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
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

                {values.photo_url && (
                  <div className="w-full flex justify-center items-center relative ">
                    <div className="relative  w-full max-h-[300px] rpunded-md overflow-hidden hover:opacity-80 transition-all duration-300 ease-in-out">
                      <Image
                        src={values.photo_url}
                        width={300}
                        height={300}
                        alt="Receipt Image"
                        className="object-contain rpunded-md w-full cursor-pointer"
                        layout="intrinsic"
                        onClick={() => setIsOpen(true)}
                      />
                      <ImageModal
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        imageUrl={values.photo_url}
                        altText="Your Image Description"
                        setFieldValue={setFieldValue}
                        handleFileChange={onFileUpload}
                        changeField="photo_url"
                      />
                    </div>
                  </div>
                )}
                <div className="w-full ">
                  <p className="text-emerald-900 text-xs">Description</p>
                  <input
                    value={values.description}
                    onChange={handleChange("description")}
                    className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg rounded-md p-2"
                  />
                </div>
                {errorM.description && (
                  <p className="text-orange-900 text-xs">
                    {errorM.description}
                  </p>
                )}
                <div className="w-full">
                  <p className="text-emerald-900 text-xs">Price</p>
                  <CurrencyInput
                    id="price"
                    name="price"
                    className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg rounded-md p-2"
                    placeholder=""
                    value={values.price}
                    defaultValue={values.price || ""}
                    decimalsLimit={2}
                    onValueChange={(values) => {
                      setFieldValue("price", values);
                    }}
                  />
                </div>
                {errorM.price && (
                  <p className="text-orange-900 text-xs">{errorM.price}</p>
                )}
                <div className="w-full ">
                  <p className="text-emerald-900 text-xs">Barcode</p>
                  <div className="flex gap-2">
                    <input
                      value={values.barcode}
                      onChange={handleChange("barcode")}
                      className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg rounded-md p-2"
                    />
                    <button
                      type="button"
                      className="w-[40px] h-[40px] border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none p-1 rounded-md flex justify-center items-center "
                      onClick={() => {
                        setShowScanner(true);
                      }}
                      disabled={showScanner}
                    >
                      <div>
                        <Image
                          src="/barcode_b.png"
                          alt="barcode"
                          width={60}
                          height={60}
                          className=""
                        ></Image>
                      </div>
                    </button>
                    {showScanner && (
                      <div className="w-full">
                        <h1>Scan a Barcode</h1>
                        <BarcodeScanner
                          setShowScanner={setShowScanner}
                          onResult={(result) => {
                            setFieldValue("barcode", result.text);
                            setShowScanner(false);
                          }}
                          onError={(error) => {}}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setShowScanner(false);
                          }}
                        >
                          Close Scanner
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full ">
                  <p className="text-emerald-900 text-xs">Character</p>
                  <input
                    value={values.character}
                    onChange={handleChange("character")}
                    className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg rounded-md p-2"
                  />
                </div>
                <div className="w-full ">
                  <p className="text-emerald-900 text-xs">Product ID</p>
                  <input
                    value={values.product_id}
                    onChange={handleChange("product_id")}
                    className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg rounded-md p-2"
                  />
                </div>
                {uploadError && (
                  <FormError
                    message={
                      uploadError === "Unauthorized"
                        ? "You are not authorized to edit this item"
                        : "Error editing item"
                    }
                  ></FormError>
                )}
              </div>
            </div>
          </div>
          {/* {uploadError && (
            <ErrorModal
              errorMessage={uploadError}
              onClose={() => setUploadError("")}
            />
          )} */}
          {isPending && <Loading loading={isPending} />}
        </div>
      )}
    </Formik>
  );
};

export default ItemIdEdit;
