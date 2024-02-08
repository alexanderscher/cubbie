import { BarcodeScanner } from "@/app/components/BarcodeScanner";
import LargeButton from "@/app/components/buttons/LargeButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import { ReceiptInput } from "@/types/formTypes/form";
import Image from "next/image";
import React, { useState } from "react";

interface ReceiptFormItemsProps {
  item: any;
  setFieldValue: any;
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
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 w-full">
      <div className="flex justify-between">
        {edit && stage !== "Final" ? (
          <div className="flex justify-between w-full">
            <input
              className="text-orange-500 border-b-[1.5px] border-slate-400 focus:outline-none bg-white bg w-full"
              value={item.description}
              onChange={(e) => handleItemChange(e, "description")}
            />
            <button
              type="button"
              className="text-sm text-orange-500"
              onClick={() => setEdit(false)}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <button type="button" className="text-orange-500">
              {item.description}
            </button>
            {stage !== "Final" && (
              <button
                type="button"
                className="text-sm text-orange-500"
                onClick={() => setEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>

      <div className="w-full h-full flex gap-6">
        {stage === "Final" && item.photo && (
          <div className="w-[120px] h-[150px] flex items-center rounded-sm flex-shrink-0">
            <div className="w-full">
              <Image
                width={200}
                height={200}
                src={item.photo}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        {stage !== "Final" && (
          <div className="w-[120px] h-[150px] flex items-center rounded-sm flex-shrink-0">
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
                          className="absolute top-0 right-0 m-1  bg-green-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                        >
                          X
                        </button>
                        <Image
                          width={200}
                          height={200}
                          src={item.photo}
                          alt=""
                          className="w-full h-full object-cover"
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
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <input
                  type="file"
                  onChange={(e) => {
                    console.log("File input changed");
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
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

        <div className="text-sm flex flex-col gap-3 items-start w-full">
          {stage !== "Final" ? (
            <RegularButton
              handleClick={toggleAsset}
              styles={
                item.asset
                  ? "bg-blue-500 text-white"
                  : "border-blue-500 text-blue-500"
              }
            >
              <p className="text-xs">Asset</p>
            </RegularButton>
          ) : (
            asset && (
              <RegularButton styles={"border-blue-500 text-blue-500"}>
                <p className="text-xs">Asset</p>
              </RegularButton>
            )
          )}

          <div className="w-full">
            <h1 className="text-slate-400 font-bold">Amount</h1>
            {edit ? (
              <input
                className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                value={item.price}
                onChange={(e) => handleItemChange(e, "price")}
              />
            ) : (
              <h1>{item.price}</h1>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 font-bold">Character</h1>
            {edit ? (
              <input
                className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                value={item.character}
                onChange={(e) => handleItemChange(e, "character")}
              />
            ) : (
              <h1>{item.character}</h1>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 font-bold">Product ID</h1>
            {edit ? (
              <input
                className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                value={item.product_id}
                onChange={(e) => handleItemChange(e, "product_id")}
              />
            ) : (
              <h1>{item.product_id}</h1>
            )}
          </div>
          <div className="w-full">
            <h1 className="text-slate-400 font-bold">Barcode</h1>
            {edit ? (
              <div className="flex flex-col gap-4">
                <input
                  className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-slate-400 focus:outline-none w-full"
                  value={item.barcode}
                  onChange={(e) => handleItemChange(e, "barcode")}
                />
                <button
                  type="button"
                  className="border-[1.5px] border-green-900 p-3 rounded-md text-green-900 w-[150px]"
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

          <RegularButton
            styles="border-green-900 bg-green-900"
            handleClick={() => removeItem(index)}
          >
            <p className="text-xs text-white">Delete</p>
          </RegularButton>
        </div>
      </div>
    </div>
  );
};

export default ReceiptFormItems;
