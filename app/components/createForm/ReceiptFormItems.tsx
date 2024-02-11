import { BarcodeScanner } from "@/app/components/BarcodeScanner";
import LargeButton from "@/app/components/buttons/LargeButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import { ItemInput, ReceiptInput } from "@/types/formTypes/form";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import React, { useState } from "react";

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
  const [asset, setAsset] = useState(false);

  const removeItem = async (index: number) => {
    const newItems = values.items.filter((_, i) => i !== index);

    setFieldValue("items", newItems);
  };

  const handleItemChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    field: string
  ) => {
    const value = typeof e === "string" ? e : e.target.value;

    const newItems = [...values.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFieldValue("items", newItems);
  };
  const [showScanner, setShowScanner] = useState(false);

  const handleError = (error: any) => {
    // console.error("Scanning error:", error);
  };

  const toggleAsset = () => {
    setAsset(!asset);
    setFieldValue("items", [
      ...values.items.slice(0, index),
      { ...values.items[index], asset: !asset },
      ...values.items.slice(index + 1),
    ]);
  };

  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 w-full pt-5">
      <div className="w-full h-full flex gap-6">
        {stage === "Final" && item.photo && (
          <div className="w-[120px] h-[150px] overflow-hidden relative flex items-center justify-center  flex-shrink-0 rounded-sm">
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
        )}
        {stage !== "Final" && (
          <div className="w-[120px] h-[150px] flex items-center  flex-shrink-0 r">
            {item.photo ? (
              <div className="w-full">
                {edit ? (
                  <div className="text-sm">
                    {item.photo && (
                      <div className=" relative flex items-center justify-center ">
                        <button
                          type="button"
                          onClick={() => {
                            setFieldValue("items", [
                              ...values.items.slice(0, index),
                              { ...values.items[index], photo: "" },
                              ...values.items.slice(index + 1),
                            ]);
                          }}
                          className="absolute top-0 right-0 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                        >
                          X
                        </button>
                        <Image
                          width={200}
                          height={200}
                          src={item.photo}
                          alt=""
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Image
                    width={200}
                    height={200}
                    src={item.photo}
                    alt=""
                    className="w-full h-full object-cover rounded-md"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full w-full">
                <input
                  type="file"
                  onChange={(e) => {
                    console.log("File input changed");
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (!file.type.match("image.*")) {
                        alert("Please upload an image file");
                        //  setUnvalidImage(true);
                        return;
                      }

                      console.log("Selected file:", file);
                      const src = URL.createObjectURL(file);
                      console.log("Blob URL:", src);
                      const newItems = [
                        ...values.items.slice(0, index),
                        { ...values.items[index], photo: src },
                        ...values.items.slice(index + 1),
                      ];
                      setFieldValue("items", newItems);
                    }
                  }}
                  id="file-upload-item"
                  style={{ opacity: 0, position: "absolute", zIndex: -1 }}
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
        )}

        <div className="text-sm flex flex-col gap-3 items-start w-full ">
          {edit && stage !== "Final" ? (
            <input
              className="text-orange-600 border-b-[1.5px] border-slate-400 focus:outline-none bg-white bg w-full"
              value={item.description}
              onChange={(e) => handleItemChange(e, "description")}
            />
          ) : (
            <button type="button" className="text-orange-600 text-lg">
              {item.description}
            </button>
          )}
          {/* {stage !== "Final" ? (
            <RegularButton
              handleClick={toggleAsset}
              styles={
                item.asset
                  ? "bg-orange-600 text-white"
                  : "border-orange-600 text-orange-600"
              }
            >
              <p className="text-sm">Asset</p>
            </RegularButton>
          ) : (
            asset && (
              <RegularButton styles={"border-orange-600 text-orange-600"}>
                <p className="text-sm">Asset</p>
              </RegularButton>
            )
          )} */}

          <div className="w-full">
            <h1 className="text-slate-400 ">AMOUNT</h1>
            {edit ? (
              <input
                className="text-emerald-900  text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                value={item.price}
                onChange={(e) => handleItemChange(e, "price")}
              />
            ) : (
              <h1>{formatCurrency(item.price)}</h1>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 ">CHARACTER</h1>
            {edit ? (
              <input
                className="text-emerald-900  text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                value={item.character}
                onChange={(e) => handleItemChange(e, "character")}
              />
            ) : (
              <h1>{item.character}</h1>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 ">PRODUCT ID</h1>
            {edit ? (
              <input
                className="text-emerald-900  text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                value={item.product_id}
                onChange={(e) => handleItemChange(e, "product_id")}
              />
            ) : (
              <h1>{item.product_id}</h1>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 ">BARCODE</h1>
            {edit ? (
              <div className="flex flex-col gap-4">
                <input
                  className="text-emerald-900  text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                  value={item.barcode}
                  onChange={(e) => handleItemChange(e, "barcode")}
                />
                <button
                  type="button"
                  className="border-[1.5px] border-emerald-900 p-3 rounded-md text-emerald-900  w-[150px]"
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
                        handleItemChange(result.text, "barcode");
                        setShowScanner(false);
                      }}
                      onError={handleError}
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
            ) : (
              <h1>{item.barcode}</h1>
            )}
          </div>
          {stage !== "Final" && (
            <div className="flex gap-2">
              <RegularButton
                styles="bg border-black "
                handleClick={() => removeItem(index)}
              >
                <p className="text-sm">Delete</p>
              </RegularButton>
              <RegularButton
                styles="bg border-black "
                handleClick={() => setEdit(!edit)}
              >
                <p className="text-sm">{edit ? "Save" : "Edit"}</p>
              </RegularButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiptFormItems;
