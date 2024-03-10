import { BarcodeScanner } from "@/app/components/createForm/barcode/BarcodeScanner";
import LargeButton from "@/app/components/buttons/LargeButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import { ItemInput, ReceiptInput } from "@/types/form";
import { formatCurrency } from "@/utils/formatCurrency";
import { ITEMS_CONTENT_SCHEMA } from "@/utils/receiptValidation";
import Image from "next/image";
import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import * as Yup from "yup";

interface FormErrors {
  [key: string]: string;
}
interface ReceiptFormItemsProps {
  item: ItemInput;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  index: number;
  values: ReceiptInput;
  stage?: string;
}

const ReceiptFormItems = ({
  item,
  index,
  setFieldValue,
  values,
  stage,
}: ReceiptFormItemsProps) => {
  const [edit, setEdit] = useState(false);
  const [invalidImage, setInvalidImage] = useState(false);

  const [showScanner, setShowScanner] = useState(false);
  const [errors, setErrors] = useState({
    description: "",
    price: "",
  });

  const [editState, setEditState] = useState<ItemInput>({
    description: item.description,
    price: item.price,
    character: item.character,
    product_id: item.product_id,
    barcode: item.barcode,
    asset: item.asset,
    photo: item.photo,
  });

  const [initialEditState, setInitialEditState] =
    useState<ItemInput>(editState);

  const toggleEdit = () => {
    if (!edit) {
      setInitialEditState(editState);
      setEdit(true);
    }
    if (edit) {
      try {
        ITEMS_CONTENT_SCHEMA.validateSync(editState, { abortEarly: false });
        const updatedItem = { ...values.items[index], ...editState };

        setFieldValue("items", [
          ...values.items.slice(0, index),
          updatedItem,
          ...values.items.slice(index + 1),
        ]);
        setEdit(false);
        setErrors({
          description: "",
          price: "",
        });
      } catch (validationError) {
        if (validationError instanceof Yup.ValidationError) {
          const errors = validationError.inner.reduce((acc, curr) => {
            if (curr.path) {
              acc[curr.path] = curr.message;
            }
            return acc;
          }, {} as FormErrors);

          setErrors((prevState) => ({
            ...prevState,
            ...errors,
          }));
        }
        return;
      }
    }
  };

  const handleCancel = () => {
    setEditState(initialEditState); // Revert to initial state
    setEdit(false);
    setErrors({ description: "", price: "" }); // Optionally clear any errors
  };

  const removeItem = async (index: number) => {
    const newItems = values.items.filter((_, i) => i !== index);
    setFieldValue("items", newItems);
  };

  const handleBarcodeResult = (barcodeValue: string) => {
    const fieldName = "barcode";
    setEditState((prevState) => ({
      ...prevState,
      [fieldName]: barcodeValue,
    }));
  };

  const handleItemChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    let parsedValue = value;

    if (type === "number" || name === "price") {
      const numericValue = parseInt(value, 10);
      parsedValue = isNaN(numericValue) ? "" : numericValue.toString();
      setEditState((prevState) => ({
        ...prevState,
        [name]: parsedValue,
      }));
    } else {
      setEditState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleCurrencyChange = (value: string | undefined) => {
    setEditState((prevState) => ({
      ...prevState,
      price: value || "",
    }));
  };

  return (
    <div className="border-t-[1px] border-black flex flex-col gap-4 w-full pt-5">
      <div className="w-full h-full flex gap-6">
        {/* {stage === "Final" && item.photo && (
          <div className="w-[120px] h-[150px] overflow-hidden relative flex items-center justify-center  flex-shrink-0 rounded-md ">
            <div className="w-full h-full flex-shrink-0">
              <Image
                width={200}
                height={200}
                src={item.photo}
                alt=""
                className="object-contain"
              />
            </div>
          </div>
        )} */}

        {stage !== "Final" && editState.photo && (
          <div className="w-[120px] h-[150px] flex items-center  flex-shrink-0 overflow-hidden rounded ">
            {edit ? (
              <div className="text-sm">
                {editState.photo && (
                  <div className=" relative flex items-center justify-center ">
                    <button
                      type="button"
                      onClick={() => {
                        setEditState((prevState) => ({
                          ...prevState,
                          photo: "",
                        }));
                      }}
                      className="absolute top-0 right-0 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm mt-3"
                    >
                      X
                    </button>
                    <Image
                      width={200}
                      height={200}
                      src={editState.photo}
                      alt=""
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className=" relative flex items-center justify-center ">
                <Image
                  width={200}
                  height={200}
                  src={editState.photo}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
          </div>
        )}
        {stage !== "Final" &&
          !editState.photo &&
          (edit ? (
            <div className="w-[120px] h-[150px] flex items-center  flex-shrink-0 overflow-hidden rounded ">
              <div className="flex flex-col h-full w-full">
                <input
                  type="file"
                  onChange={(e) => {
                    console.log("File input changed");
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (!file.type.match("image.*")) {
                        alert("Please upload an image file");
                        return;
                      }

                      if (!file.type.match("image.*")) {
                        setInvalidImage(true);
                        return;
                      }

                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          setEditState((prevState) => ({
                            ...prevState,
                            photo: reader.result as string,
                          }));
                          setInvalidImage(false);
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
            </div>
          ) : (
            <div className="w-[120px] h-[150px] flex items-center  flex-shrink-0 overflow-hidden rounded ">
              <div className="flex flex-col h-full w-full">
                <LargeButton height="h-full">
                  <label
                    htmlFor="file-upload-item"
                    className="w-full h-full flex justify-center items-center"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    Edit
                  </label>
                </LargeButton>
              </div>
            </div>
          ))}

        <div className="text-sm flex flex-col gap-4 items-start w-full ">
          <div className="w-full">
            {edit && stage !== "Final" ? (
              <input
                className="text-orange-600 border-b-[1px] border-slate-400 focus:outline-none bg-white bg w-full"
                value={editState.description || ""}
                name="description"
                onChange={handleItemChange}
              />
            ) : item.description ? (
              <button type="button" className="text-orange-600 text-lg">
                {item.description}
              </button>
            ) : (
              <h1 className="text-orange-900">Description is required</h1>
            )}
            {errors.description && (
              <p className="text-orange-900">{errors.description}</p>
            )}
          </div>

          {values.assetAmount &&
            item.price &&
            item.price >= values.assetAmount &&
            !edit && <p className="text-emerald-900">Asset</p>}

          <div className="w-full">
            <h1 className="text-slate-400 ">AMOUNT</h1>
            {edit ? (
              <CurrencyInput
                id="price"
                name="price"
                className="text-sm bg-white border-b-[1px] bg border-slate-400 focus:outline-none w-full"
                placeholder=""
                value={editState.price}
                defaultValue={editState.price || ""}
                decimalsLimit={2}
                onValueChange={handleCurrencyChange}
              />
            ) : item.price ? (
              <h1>{formatCurrency(item.price)}</h1>
            ) : (
              <h1 className="text-orange-900">Price is required</h1>
            )}
            {errors.price && <p className="text-orange-900">{errors.price}</p>}
          </div>

          <div className="w-full">
            <h1 className="text-slate-400 ">CHARACTER</h1>
            {edit ? (
              <input
                className="  text-sm bg-white border-b-[1px] bg border-slate-400 focus:outline-none w-full"
                name="character"
                value={editState.character || ""}
                onChange={handleItemChange}
              />
            ) : item.character ? (
              <h1>{item.character}</h1>
            ) : (
              <h1 className="text-slate-600">None</h1>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 ">PRODUCT ID</h1>
            {edit ? (
              <input
                className="  text-sm bg-white border-b-[1px] bg border-slate-400 focus:outline-none w-full"
                name="product_id"
                value={editState.product_id}
                onChange={handleItemChange}
              />
            ) : item.product_id ? (
              <h1>{item.product_id}</h1>
            ) : (
              <h1 className="text-slate-600">None</h1>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 ">BARCODE</h1>
            {edit ? (
              <div className="flex flex-col gap-4">
                <input
                  className="  text-sm bg-white border-b-[1px] bg border-slate-400 focus:outline-none w-full"
                  name="barcode"
                  value={editState.barcode}
                  onChange={handleItemChange}
                />
                <button
                  type="button"
                  className="border-[1px] border-emerald-900 p-4 rounded   w-[150px]"
                  onClick={() => {
                    setShowScanner(true);
                  }}
                  disabled={showScanner}
                >
                  Scan barcode
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
            ) : item.barcode ? (
              <h1>{item.barcode}</h1>
            ) : (
              <h1 className="text-slate-600">None</h1>
            )}
          </div>
          {stage !== "Final" && (
            <div className="flex flex-col w-full max-w-[300px] gap-4">
              <div className="flex gap-4">
                {" "}
                <RegularButton
                  small
                  styles="bg border-black w-full"
                  handleClick={() => removeItem(index)}
                >
                  <p className="text-xs">Delete</p>
                </RegularButton>
                <RegularButton
                  small
                  styles="bg border-black w-full"
                  handleClick={toggleEdit}
                >
                  <p className="text-xs">{edit ? "Save" : "Edit"}</p>
                </RegularButton>
              </div>

              {edit && (
                <RegularButton
                  small
                  styles="bg border-black "
                  handleClick={handleCancel}
                >
                  <p className="text-xs">Cancel</p>
                </RegularButton>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptFormItems;
