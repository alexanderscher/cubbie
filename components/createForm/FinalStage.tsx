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
import ErrorModal from "@/components/error/Modal";
import BottomBar from "@/components/createForm/BottomBar";
import { formatCurrency } from "@/utils/formatCurrency";
import ImageModal from "@/components/images/ImageModal";
import CurrencyInput from "react-currency-input-field";
import LargeButton from "@/components/buttons/LargeButton";
import { BarcodeScanner } from "@/components/createForm/barcode/BarcodeScanner";
import { usePathname, useRouter } from "next/navigation";
import PurchaseTypeSelect from "@/components/select/PurchaseTypeSelect";

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
            <p className="text-emerald-900  text-xs">Discard</p>
          </RegularButton>
          <div className="flex gap-2 ">
            <RegularButton
              styles={"border-emerald-900 "}
              handleClick={() => {
                if (pathname === "/create/manual") {
                  setStage(ReceiptOnlineStage.ONLINE_RECEIPT);
                } else if (pathname === "/create/text") {
                  setStage(ReceiptOnlineStage.ONLINE_ITEMS);
                } else if (pathname === "/create/image") {
                  setStage(ReceiptStoreStage.IN_STORE_GPT);
                }
              }}
            >
              <p className="text-emerald-900 text-xs">Back</p>
            </RegularButton>

            {loading ? (
              <RegularButton styles={"bg-emerald-900 border-emerald-900 "}>
                <p className="text-white text-xs">Uploading...</p>
              </RegularButton>
            ) : (
              <RegularButton
                type="submit"
                styles={"bg-emerald-900 border-emerald-900 "}
              >
                <p className="text-white text-xs">Submit</p>
              </RegularButton>
            )}
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const handleCurrencyChangeAsset = (value: string | undefined) => {
    setFieldValue("assetAmount", value || "");
  };
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-8  w-full h-full mt-8">
      {values.items.length > 0 && (
        <div className="w-full flex justify-end">
          <RegularButton
            styles={"bg-emerald-900 text-white text-xs  border-emerald-900"}
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
            {/* <p className="text-xl text-emerald-900">
              {pathname !== "/create/memo"
                ? "Receipt Information"
                : "Memo Information"}
            </p> */}
            {!values.receiptImage && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                <div className="w-full h-full flex justify-center items-start ">
                  <Image
                    src="/receipt_b.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover pt-4"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            )}

            {values.receiptImage && (
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
            )}

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
              {/* <div className="w-full  border-emerald-900 border-b-[1px] pb-2 ">
                <p className="text-emerald-900 text-xs">Receipt Type</p>
                <p className="">{values.type}</p>
              </div> */}
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

              {pathname === "/create/text" && (
                <div className="w-full ">
                  <p className="text-emerald-900 text-xs">Tracking Link</p>
                  {/* <p className="">
                    {values.tracking_number ? values.tracking_number : "None"}
                  </p> */}
                  <input
                    className="w-full border-[1px] bg  p-2 rounded border-emerald-900 focus:border-emerald-900 focus:outline-none"
                    name="tracking_number"
                    value={values.tracking_number}
                    onChange={(e) => {
                      setFieldValue("tracking_number", e.target.value);
                    }}
                  />
                </div>
              )}

              <div className="w-full pb-2 ">
                <p className="text-emerald-900 text-xs">Asset Amount</p>

                <CurrencyInput
                  id="price"
                  name="price"
                  className="text-sm bg-white border-[1px] rounded p-2 bg border-emerald-900 focus:border-emerald-900 focus:outline-none w-full"
                  placeholder=""
                  value={values.assetAmount}
                  defaultValue={values.assetAmount || ""}
                  decimalsLimit={2}
                  onValueChange={handleCurrencyChangeAsset}
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
                  asset_amount={parseInt(values.assetAmount)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {isAddOpen && (
        <AddItemModal
          isAddOpen={isAddOpen}
          setIsAddOpen={setIsAddOpen}
          items={values.items}
          setFieldValue={setFieldValue}
        />
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
          src="/item_b.png"
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
  asset_amount: number;
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
  asset_amount,
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
            <div className="flex flex-col h-full w-full">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    if (!file.type.match("image.*")) {
                      alert("Please upload an image file");
                      return;
                    }

                    // if (!file.type.match("image.*")) {
                    //   setInvalidImage(true);
                    //   return;
                    // }

                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                      if (typeof reader.result === "string") {
                        const updatedItems = [...items];
                        updatedItems[index].photo = reader.result;
                        setFieldValue("items", updatedItems);
                        // setInvalidImage(false);
                      }
                    };
                    reader.onerror = (error) => {
                      console.error("Error converting file to base64:", error);
                    };
                  }
                }}
                id="file-upload-item"
                style={{
                  opacity: 0,
                  position: "absolute",
                  zIndex: -1,
                  width: "100%",
                  height: "100%",
                }}
              />
              <LargeButton height="h-full">
                <label
                  htmlFor="file-upload-item"
                  className="w-full h-full flex justify-center items-center"
                  style={{
                    cursor: "pointer",
                  }}
                >
                  Upload File
                </label>
              </LargeButton>
            </div>
          )}
        </div>

        <div className="text-sm flex flex-col gap-4 items-start w-full ">
          {parseInt(item.price) > asset_amount && (
            <p className="text-orange-600">Asset</p>
          )}
          <div className="w-full">
            <h1 className="text-emerald-900 text-xs">Description</h1>

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

          <div className="w-full">
            <h1 className="text-emerald-900 text-xs">Product ID</h1>

            <input
              className="  text-sm bg-white border-[1px] rounded p-2 bg border-emerald-900 focus:outline-none w-full"
              name="product_id"
              value={item.product_id}
              onChange={handleItemChange}
            />
          </div>
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
                    src="/barcode_b.png"
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
  );
};

interface AddItemModalProps {
  isAddOpen: boolean;
  setIsAddOpen: (value: boolean) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  items: ItemInput[];
}

const AddItemModal = ({
  isAddOpen,
  setIsAddOpen,
  setFieldValue,
  items,
}: AddItemModalProps) => {
  const [newItem, setNewItem] = useState({
    description: "",
    price: "",
    barcode: "",
    product_id: "",
    character: "",
    photo: "",
  });

  const [showScanner, setShowScanner] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleCurrencyChange = (value: string | undefined) => {
    setNewItem({ ...newItem, price: value || "" });
  };

  const [error, setError] = useState({
    description: "",
    price: "",
  });

  const itemSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
  });

  const handleSubmit = async () => {
    try {
      await itemSchema.validate(newItem, { abortEarly: false });
      setFieldValue("items", [...items, newItem]);
      setIsAddOpen(false);
      setNewItem({
        description: "",
        price: "",
        barcode: "",
        product_id: "",
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

  const handleBarcodeResult = (barcodeValue: string) => {
    setNewItem({ ...newItem, barcode: barcodeValue });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[2000]">
      <div className="bg-white rounded shadow-xl m-4 max-w-md w-full">
        <div className="flex justify-between items-center border-b border-gray-200 px-5 py-4 bg-slate-100 rounded-t-lg">
          <h3 className="text-lg text-emerald-900">Add Item</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setIsAddOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900">Description*</p>
              <input
                type="text"
                name="description"
                value={newItem.description}
                onChange={handleChange}
                className="w-full p-2 border-[1px] border-emerald-900 rounded"
              />
              {error.description && (
                <p className="text-orange-900 text-xs">{error.description}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-emerald-900">Price*</p>
              <CurrencyInput
                id="price"
                name="price"
                className="text-sm bg-white border-[1px] rounded p-2  border-emerald-900 focus:outline-none w-full"
                placeholder=""
                value={newItem.price}
                defaultValue={newItem.price || ""}
                decimalsLimit={2}
                onValueChange={handleCurrencyChange}
              />
              {error.price && (
                <p className="text-orange-900 text-xs">{error.price}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-emerald-900">Barcode</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="barcode"
                  value={newItem.barcode}
                  onChange={handleChange}
                  className="w-full p-2 border-[1px] border-emerald-900 rounded"
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
                      src="/barcode_b.png"
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
                      onError={(error) => {
                        console.log(error);
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

            <div>
              <p className="text-xs text-emerald-900">Product ID</p>
              <input
                type="text"
                name="product_id"
                value={newItem.product_id}
                onChange={handleChange}
                className="w-full p-2 border-[1px] border-emerald-900 rounded"
              />
            </div>
            <div>
              <p className="text-xs text-emerald-900">Character</p>
              <input
                type="text"
                name="character"
                value={newItem.character}
                onChange={handleChange}
                className="w-full p-2 border-[1px] border-emerald-900 rounded"
              />
            </div>
            <div>
              <p className="text-xs text-emerald-900">Image</p>

              <div className="relative w-full h-[70px] overflow-hidden border-[1px] border-dashed rounded bg-slate-100 flex flex-col border-emerald-900 justify-center items-center ">
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (!file.type.match("image.*")) {
                        alert("Please upload an image file");
                        return;
                      }

                      // if (!file.type.match("image.*")) {
                      //   setInvalidImage(true);
                      //   return;
                      // }

                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          setNewItem({ ...newItem, photo: reader.result });
                          // setInvalidImage(false);
                        }
                      };
                      reader.onerror = (error) => {
                        console.error(
                          "Error converting file to base64:",
                          error
                        );
                      };
                    }
                  }}
                  id="add-photo"
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <Image
                  src="/image_b.png"
                  alt=""
                  width={40}
                  height={40}
                  className="object-cover z-0"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
                <label
                  htmlFor="add-photo"
                  className="absolute inset-0 w-full h-full flex flex-col justify-center items-center "
                ></label>
              </div>
            </div>
            {newItem.photo && (
              <div className="w-24 h-24 flex items-center flex-shrink-0 overflow-visible rounded relative">
                {newItem.photo && (
                  <div className="relative flex items-center justify-center w-full h-full">
                    <button
                      type="button"
                      onClick={() => {
                        setNewItem({
                          ...newItem,
                          photo: "",
                        });
                      }}
                      className="absolute z-10 -top-2 -right-2 m-1 bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm leading-none"
                      style={{ lineHeight: "1" }}
                    >
                      &times;
                    </button>
                    <Image
                      width={200}
                      height={200}
                      src={newItem.photo}
                      alt=""
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <RegularButton
              type="button"
              styles="bg-emerald-900 text-white border-emerald-900"
              handleClick={handleSubmit}
            >
              <p className="text-xs">Add Item</p>
            </RegularButton>
          </div>
        </div>
      </div>
    </div>
  );
};
