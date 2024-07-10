"use client";
import RegularButton from "@/components/buttons/RegularButton";
import { ReceiptOnlineStage, ReceiptStoreStage } from "@/constants/form";
import { ItemInput, ReceiptInput } from "@/types/form";
import {
  calculateReturnDate,
  formatDateToMMDDYY,
  formatDateToYYYYMMDD,
} from "@/utils/Date";
import styles from "./form.module.css";
import * as Yup from "yup";
import Image from "next/image";
import React, { useState } from "react";
import ErrorModal from "@/components/modals/ErrorModal";
import BottomBar from "@/components/createForm/BottomBar";
import { formatCurrency } from "@/utils/formatCurrency";
import CurrencyInput from "react-currency-input-field";
import { BarcodeScanner } from "@/components/createForm/barcode/BarcodeScanner";
import { usePathname, useRouter } from "next/navigation";
import PurchaseTypeSelect from "@/components/selects/PurchaseTypeSelect";
import FileUploadDropzone from "@/components/dropzone/FileUploadDropzone";
import { convertHeic } from "@/utils/media";
import { AddItem } from "@/components/item/AddItem";
import { ModalOverlay } from "@/components/overlays/ModalOverlay";
import SubmitButton from "@/components/buttons/SubmitButton";

interface FinalStageProps {
  values: any;
  setStage: (stage: any) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  loading: boolean;
  uploadError: string;
  setUploadError: (value: string) => void;
}

const FinalStage = ({
  values,
  setStage,
  setFieldValue,
  loading,
  uploadError,
  setUploadError,
}: FinalStageProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 max-w-[1000px] w-full">
      <ReceiptPageForm values={values} setFieldValue={setFieldValue} />
      <BottomBar>
        <div className="flex justify-between w-full">
          <RegularButton
            styles="bg-white border-emerald-900"
            handleClick={async () => {
              router.push("/");
            }}
          >
            <p className="text-emerald-900  text-sm">Discard</p>
          </RegularButton>
          <div className="flex gap-2 ">
            <RegularButton
              styles={"border-emerald-900 "}
              handleClick={() => {
                if (pathname === "/create/manual") {
                  setStage(ReceiptOnlineStage.ONLINE_RECEIPT);
                } else if (pathname === "/create/image") {
                  setStage(ReceiptStoreStage.IN_STORE_GPT);
                }
              }}
            >
              <p className="text-emerald-900 text-sm">Back</p>
            </RegularButton>
            <SubmitButton
              type="submit"
              loading={loading}
              disabled={
                !values.store || !values.folderName || !values.items.length
              }
            >
              <p className="text-sm">Submit</p>
            </SubmitButton>
          </div>
        </div>
      </BottomBar>

      {uploadError && (
        <ErrorModal
          errorMessage={uploadError}
          onClose={() => setUploadError("")}
        />
      )}
    </div>
  );
};

export default FinalStage;

interface ReceiptPageProps {
  values: ReceiptInput;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

const ReceiptPageForm = ({ values, setFieldValue }: ReceiptPageProps) => {
  const [isAddOpen, setIsAddOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-8  w-full h-full mt-8">
      {values.items.length > 0 && (
        <div className="w-full flex justify-between">
          <h1 className="text-2xl text-orange-600">Items</h1>
          <RegularButton
            styles={"bg text-emerald-900 text-xs  border-emerald-900"}
            handleClick={() => {
              setIsAddOpen(true);
            }}
          >
            Add Item
          </RegularButton>
        </div>
      )}
      <div className={`${styles.receipt} `}>
        <div
          className={`${styles.receiptLeft}  flex flex-col gap-2 pb-[10px] md:pb-[200px]`}
        >
          <div
            className={`border-[1px] border-emerald-900 rounded  flex flex-col gap-4 p-6`}
          >
            {/* {!values.receiptImage && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                <div className="w-full h-full flex justify-center items-start ">
                  <Image
                    src="/green/receipt_green.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover pt-4"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            )} */}

            {/* {values.receiptImage && (
              <div className="w-full flex justify-center items-center  ">
                <div className=" w-[200px] max-h-[200px]  rounded overflow-hidden">
                  <Image
                    src={values.receiptImage}
                    width={280}
                    height={280}
                    alt="Receipt Image"
                    className="object-contain rounded cursor-pointer"
                    layout="intrinsic"
                    onClick={() => setIsOpen(true)}
                  />
                </div>
                <ImageModal
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  imageUrl={values.receiptImage ? values.receiptImage : ""}
                  altText="Your Image Description"
                />
              </div>
            )} */}

            <div className="flex flex-col gap-4 text-sm ">
              <div className="w-full">
                <p className="text-xs text-emerald-900 ">Store</p>

                <input
                  className="w-full border-[1px] bg border-emerald-900 p-2 rounded  focus:border-emerald-900 focus:outline-none"
                  value={values.store}
                  onChange={(e) => {
                    setFieldValue("store", e.target.value);
                  }}
                />
              </div>
              <div className="w-full  border-emerald-900 border-b-[1px] pb-2 ">
                <p className="text-emerald-900 text-xs">Total amount</p>
                <p>
                  {formatCurrency(
                    values.items.reduce((acc: number, curr: ItemInput) => {
                      return acc + parseFloat(curr.price);
                    }, 0)
                  )}
                </p>
              </div>

              <div className="w-full pb-2 ">
                <p className="text-emerald-900 text-xs">Purchase Date</p>
                <input
                  className="w-full border-[1px] bg  p-2 rounded border-emerald-900 focus:border-emerald-900 focus:outline-none cursor-pointer"
                  name="purchase_date"
                  value={formatDateToYYYYMMDD(values.purchase_date)}
                  onChange={(e) => {
                    setFieldValue("purchase_date", e.target.value);
                  }}
                  type="date"
                  style={{ WebkitAppearance: "none" }}
                />
              </div>

              <div className="w-full">
                <p className="text-xs text-emerald-900 ">Days until return</p>
                <input
                  className="w-full border-[1px] bg border-emerald-900 p-2 rounded  focus:border-emerald-900 focus:outline-none"
                  name="days_until_return"
                  value={values.days_until_return}
                  onChange={(event) => {
                    const value = parseInt(event.target.value, 10);
                    setFieldValue(
                      "days_until_return",
                      isNaN(value) ? "" : value
                    );
                  }}
                />
              </div>
              <div className="w-full  border-emerald-900 border-b-[1px] pb-2 ">
                <p className="text-emerald-900 text-xs">Return Date</p>
                <p>
                  {formatDateToMMDDYY(
                    calculateReturnDate(
                      values.purchase_date,
                      values.days_until_return
                    )
                  )}
                </p>
              </div>

              <div className="w-full  border-emerald-900 border-b-[1px] pb-2 ">
                <p className="text-emerald-900 text-xs">Project</p>
                <p className="">{values.folderName}</p>
              </div>

              <div className="w-full  border-emerald-900 border-b-[1px] pb-2 ">
                <p className="text-emerald-900 text-xs">Quantity</p>
                <p className="">{values.items.length}</p>
              </div>
              <PurchaseTypeSelect
                type={values.type}
                setFieldValue={setFieldValue}
              />

              <div className="w-full">
                <p className="text-xs text-emerald-900 ">Card</p>
                <input
                  className="w-full border-[1px] bg  p-2 rounded border-emerald-900 focus:border-emerald-900 focus:outline-none"
                  name="card"
                  value={values.card}
                  onChange={(e) => {
                    setFieldValue("card", e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {values.items.length === 0 && (
          <div className="pb-[200px] w-full">
            <PlaceHolder setIsAddOpen={setIsAddOpen} />
          </div>
        )}
        {values.items.length > 0 && (
          <div className={`flex flex-col gap-2 pb-[200px] w-full`}>
            <div className={`${styles.boxes} `}>
              {values.items.map((item: any, index: number) => (
                <ReceiptItems
                  key={item.id}
                  item={item}
                  index={index}
                  items={values.items}
                  setFieldValue={setFieldValue}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {isAddOpen && (
        <ModalOverlay onClose={() => setIsAddOpen(false)}>
          <AddItemModal
            isAddOpen={isAddOpen}
            setIsAddOpen={setIsAddOpen}
            items={values.items}
            setFieldValue={setFieldValue}
          />
        </ModalOverlay>
      )}
    </div>
  );
};

interface PlaceHolderProps {
  setIsAddOpen: (value: boolean) => void;
}
const PlaceHolder = ({ setIsAddOpen }: PlaceHolderProps) => {
  return (
    <div className={styles.placeholder}>
      <div className="w-full  flex justify-center items-center">
        <Image
          src="/green/item_green.png"
          alt=""
          width={60}
          height={60}
          className="object-cover "
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <RegularButton
        styles={"bg-emerald-900 text-white text-xs w-1/2  border-emerald-900"}
        handleClick={() => {
          setIsAddOpen(true);
        }}
      >
        Add Item
      </RegularButton>
    </div>
  );
};

interface ReceiptItemsProps {
  item: ItemInput;
  index: number;
  items: ItemInput[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}
type ItemInputKey = keyof ItemInput;

const ReceiptItems = ({
  item,
  index,
  items,
  setFieldValue,
}: ReceiptItemsProps) => {
  const [showScanner, setShowScanner] = useState(false);

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as ItemInputKey;
    if (!key) return;

    const updatedItems = [...items];
    updatedItems[index][key] = e.target.value;
    setFieldValue("items", updatedItems);
  };

  const handleCurrencyChange = (value: string | undefined) => {
    const updatedItems = [...items];
    updatedItems[index].price = value || "";
    setFieldValue("items", updatedItems);
  };

  const removeItem = async (index: number) => {
    const updatedItems = [...items];
    const newItems = updatedItems.filter((_, i) => i !== index);
    setFieldValue("items", newItems);
  };

  const handleBarcodeResult = (barcodeValue: string) => {
    const updatedItems = [...items];
    updatedItems[index].barcode = barcodeValue || "";
    setFieldValue("items", updatedItems);
  };

  const duplicateItem = () => {
    const updatedItems = [...items];
    updatedItems.push(items[index]);
    setFieldValue("items", updatedItems);
  };

  const onFileUpload = async (file: File) => {
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
        const updatedItems = [...items];
        updatedItems[index].photo = reader.result;
        setFieldValue("items", updatedItems);
      }
    };
    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
    };
  };

  return (
    <div className="border-t-[1px] border-black flex flex-col gap-4 w-full pt-5 ">
      <div className="w-full h-full flex gap-6">
        <div className="w-[120px] h-[150px] flex items-center flex-shrink-0 overflow-visible rounded relative">
          {item.photo && (
            <div className="relative flex items-center justify-center w-full h-full">
              <button
                type="button"
                onClick={() => {
                  const updatedItems = [...items];
                  updatedItems[index].photo = "";
                  setFieldValue("items", updatedItems);
                }}
                className="absolute z-10 -top-2 -right-2 m-1 bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm leading-none"
                style={{ lineHeight: "1" }}
              >
                &times;
              </button>
              <Image
                width={200}
                height={200}
                src={item.photo}
                alt=""
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
          {!item.photo && (
            <FileUploadDropzone
              onFileUpload={onFileUpload}
              button={
                <div className="w-full h-[150px] soverflow-hidden  border-[1px]  border-emerald-900  focus:border-emerald-900 focus:outline-none rounded-lg  relative flex flex-col items-center justify-center cursor-pointer gap-5">
                  <Image
                    src="/green/addimage_green.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover "
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <p className="text-xs text-emerald-900 text-center pl-2 pr-2">
                    Upload photo or drag and drop
                  </p>
                </div>
              }
            />
          )}
        </div>

        <div className="text-sm flex flex-col gap-4 items-start w-full ">
          <div className="w-full">
            <h1 className="text-emerald-900 text-xs">Item Name</h1>

            <input
              className="  text-sm bg-white border-[1px] rounded p-2 bg border-emerald-900 focus:outline-none w-full"
              name="description"
              value={item.description || ""}
              onChange={handleItemChange}
            />
          </div>
          <div className="w-full">
            <h1 className="text-emerald-900 text-xs">Amount</h1>

            <CurrencyInput
              id="price"
              name="price"
              className="text-sm bg-white border-[1px] rounded p-2 bg border-emerald-900 focus:outline-none w-full"
              placeholder=""
              value={item.price}
              defaultValue={item.price || ""}
              decimalsLimit={2}
              onValueChange={handleCurrencyChange}
            />
          </div>

          <div className="w-full">
            <h1 className="text-emerald-900 text-xs">Character</h1>

            <input
              className="  text-sm bg-white border-[1px] rounded p-2 bg border-emerald-900 focus:outline-none w-full"
              name="character"
              value={item.character || ""}
              onChange={handleItemChange}
            />
          </div>

          {/* <div className="w-full">
            <h1 className="text-emerald-900 text-xs">Product ID</h1>

            <input
              className="  text-sm bg-white border-[1px] rounded p-2 bg border-emerald-900 focus:outline-none w-full"
              name="product_id"
              value={item.product_id}
              onChange={handleItemChange}
            />
          </div> */}
          <div className="w-full">
            <h1 className="text-emerald-900 text-xs">Barcode</h1>

            <div className="flex  w-full gap-2">
              <input
                className="w-full  text-sm bg-white border-[1px] rounded p-2 bg border-emerald-900 focus:outline-none "
                name="barcode"
                value={item.barcode}
                onChange={handleItemChange}
              />
              <button
                type="button"
                className="w-[40px] border-[1px] border-emerald-900 p-4 rounded flex justify-center items-center  "
                onClick={() => {
                  setShowScanner(true);
                }}
                disabled={showScanner}
              >
                <div className="w-[40px]">
                  <Image
                    src="/green/barcode_green.png"
                    alt="barcode"
                    width={50}
                    height={50}
                  ></Image>
                </div>
              </button>

              {showScanner && (
                <div className="w-full">
                  <h1>Scan a Barcode</h1>
                  <BarcodeScanner
                    setShowScanner={setShowScanner}
                    onResult={(result) => {
                      handleBarcodeResult(result.text);

                      setShowScanner(false);
                    }}
                    onError={() => {
                      console.log("Error");
                    }}
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
          <div className="w-full">
            <div className="w-full flex justify-end mt-2">
              <RegularButton
                small
                styles="bg-emerald-900 border-emerald-900  w-full"
                handleClick={() => duplicateItem()}
              >
                <p className="text-xs text-white">Duplicate</p>
              </RegularButton>
            </div>
            <div className="w-full flex justify-end mt-2">
              <RegularButton
                small
                styles="bg-emerald-900 border-emerald-900  w-full"
                handleClick={() => removeItem(index)}
              >
                <p className="text-xs text-white">Delete</p>
              </RegularButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddItemModalProps {
  isAddOpen: boolean;
  setIsAddOpen: (value: boolean) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  items: ItemInput[];
}

const AddItemModal = ({
  setIsAddOpen,
  setFieldValue,
  items,
}: AddItemModalProps) => {
  const [newItem, setNewItem] = useState({
    description: "",
    price: "0.00",
    barcode: "",
    character: "",
    photo: "",
  });

  const [error, setError] = useState({
    description: "",
    price: "",
  });

  const itemSchema = Yup.object({
    description: Yup.string().required("Item name is required"),
    price: Yup.string().required("Price is required"),
  });

  const handleSubmit = async () => {
    try {
      await itemSchema.validate(newItem, { abortEarly: false });
      setFieldValue("items", [...items, newItem]);
      setIsAddOpen(false);
      setNewItem({
        description: "",
        price: "0.00",
        barcode: "",
        character: "",
        photo: "",
      });
      setError({
        description: "",
        price: "",
      });
    } catch (error) {
      let errorsObject = {};

      if (error instanceof Yup.ValidationError) {
        errorsObject = error.inner.reduce((acc, curr) => {
          const key = curr.path || "unknownField";
          acc[key] = curr.message;
          return acc;
        }, {} as Record<string, string>);
      }

      setError(
        errorsObject as {
          description: string;
          price: string;
        }
      );
    }
  };

  return (
    <AddItem
      setIsAddOpen={setIsAddOpen}
      handleSubmit={handleSubmit}
      setNewItem={setNewItem}
      newItem={newItem}
      error={error}
    />
  );
};
