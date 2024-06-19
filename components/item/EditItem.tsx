"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import RegularButton from "@/components/buttons/RegularButton";
import Image from "next/image";
import { Formik } from "formik";
import { EDIT_ITEM_SCHEMA } from "@/utils/editValidation";
import CurrencyInput from "react-currency-input-field";
import Loading from "@/components/loading/Loading";
import { BarcodeScanner } from "@/components/createForm/barcode/BarcodeScanner";
import ImageModal from "@/components/images/ImageModal";
import { convertHeic } from "@/utils/media";
import { editItem } from "@/actions/items/editItem";
import FileUploadDropzone from "@/components/dropzone/FileUploadDropzone";
import { toast } from "sonner";
import { ItemType } from "@/types/ItemsTypes";
import { getItemsByIdClient } from "@/lib/getItemsClient";
import PageLoading from "@/components/loading/PageLoading";
import { useSearchItemContext } from "@/components/context/SearchItemContext";

interface ItemIdEditProps {
  itemId: string;
  setEdit: (value: boolean) => void;
}

type ExtendedItemType = ItemType & {
  edit_image: string;
};
const EditItem = ({ itemId, setEdit }: ItemIdEditProps) => {
  const { reloadItems } = useSearchItemContext();
  const [errorM, setErrorM] = useState({
    price: "",
    description: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [item, setItem] = useState<ExtendedItemType>({
    barcode: "",
    character: "",
    created_at: new Date(),
    description: "",
    id: 0,
    photo_key: "",
    photo_url: "",
    price: 0,
    receipt: {
      card: "",
      created_at: new Date(),
      days_until_return: 0,
      expired: false,
      id: 0,
      memo: false,
      project: {
        asset_amount: 0,
        created_at: new Date(),
        id: 0,
        name: "",
        userId: "",
      },
      project_id: 0,
      purchase_date: new Date(),
      receipt_image_key: "",
      receipt_image_url: "",
      return_date: new Date(),
      store: "",
      tracking_number: "",
      type: "",
    },
    receipt_id: 0,
    returned: false,
    edit_image: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getitem = async () => {
      const item = await getItemsByIdClient(itemId);
      if (item) {
        setItem({
          ...item,
          edit_image: "",
        });
      }
      setIsLoading(false);
    };

    getitem();
  }, [itemId]);

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

  if (isLoading)
    return (
      <div className="w-full ">
        <PageLoading loading={isLoading} />
      </div>
    );
  return (
    <Formik
      initialValues={{
        ...item,
      }}
      onSubmit={(values) => {
        startTransition(async () => {
          try {
            const result = await editItem(itemId, values, item.receipt);

            if (result?.error) {
              toast.error("An error occurred. Please try again.");
            } else {
              toast.success("Item updated successfully.");
              reloadItems();
              setEdit(false);
            }
          } catch (e) {
            toast.error("An error occurred. Please try again.");
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
        <div className=" w-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center border-b  px-5 py-3 rounded-t-lg border-emerald-900">
            <h3 className="text-md text-emerald-900">
              Edit {item.description}
            </h3>
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

          <div className="flex flex-col gap-4 p-8">
            {!values.photo_url && !values.edit_image && (
              <FileUploadDropzone
                onFileUpload={(e) => {
                  onFileUpload(e, setFieldValue);
                }}
                button={
                  <div className="w-full h-[150px] soverflow-hidden  border-[1.5px] border-dashed border-emerald-900  focus:border-emerald-900 focus:outline-none rounded  relative flex flex-col items-center justify-center cursor-pointer gap-5">
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
                <div className="relative  w-[200px] max-h-[400px] rounded overflow-hidden">
                  <Image
                    src={values.edit_image}
                    width={300}
                    height={300}
                    alt="Receipt Image"
                    className="object-contain rounded w-full cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out"
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
              <p className="text-emerald-900 text-xs">Item Name</p>
              <input
                value={values.description}
                onChange={handleChange("description")}
                className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg-white  rounded p-2"
              />
            </div>
            {errorM.description && (
              <p className="text-orange-900 text-xs">{errorM.description}</p>
            )}
            <div className="w-full">
              <p className="text-emerald-900 text-xs">Price</p>
              <CurrencyInput
                id="price"
                name="price"
                className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg-white  rounded p-2"
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
                  value={values.barcode || ""}
                  onChange={handleChange("barcode")}
                  className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg-white  rounded p-2"
                />
                <button
                  type="button"
                  className="w-[40px] h-[40px] border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none p-1 rounded flex justify-center items-center "
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
                value={values.character || ""}
                onChange={handleChange("character")}
                className="w-full border-[1px] border-emerald-900 focus:border-emerald-900 focus:outline-none bg-white  rounded p-2"
              />
            </div>
            <div className="">
              {dirty ? (
                <div className="flex justify-between  w-full">
                  <RegularButton
                    styles=" border-emerald-900 focus:border-emerald-900 focus:outline-none"
                    href={`/item/${itemId}`}
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
                  styles="border-emerald-900"
                  href={`/item/${itemId}`}
                >
                  <p className="text-emerald-900 text-xs">Cancel</p>
                </RegularButton>
              )}
            </div>
          </div>

          {isPending && <Loading loading={isPending} />}
        </div>
      )}
    </Formik>
  );
};

export default EditItem;
