import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import { BarcodeScanner } from "@/app/components/BarcodeScanner";
import RegularButton from "@/app/components/buttons/RegularButton";
import { ReceiptInput } from "@/types/formTypes/form";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import React, { useState } from "react";

interface ReceiptFormItemsProps {
  item: any;
  setFieldValue: any;
  index: number;
  values: ReceiptInput;
}

const ReceiptFormItems = ({
  item,
  index,
  setFieldValue,
  values,
}: ReceiptFormItemsProps) => {
  const [edit, setEdit] = useState(false);
  const [asset, setAsset] = useState(false);

  const removeItem = async (index: number) => {
    const item = values.items[index];

    if (item && item.photo && item.photo.length > 0) {
      try {
        await deleteUploadThingImage(item.photo[0].key);
        console.log("Photo deleted successfully");
      } catch (error) {
        console.error("Error deleting photo:", error);
      }
    }
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
  const [isBarcode, setIsBarcode] = useState(false);

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
        {edit ? (
          <div className="flex justify-between w-full">
            <input
              className="text-orange-500  bg-white  bg border-green-900"
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
            <button
              type="button"
              className="text-sm text-orange-500"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div className="w-full h-full flex gap-6">
        <div className="w-[120px] h-[150px] flex items-center rounded-sm flex-shrink-0">
          {item.photo.length > 0 ? (
            <div className="w-full">
              <Image
                width={200}
                height={200}
                src={item.photo[0].url}
                alt=""
                className="w-full h-full object-cover"
              />
              {edit && (
                <div className="text-sm">
                  <UploadButton
                    appearance={{
                      button:
                        "ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed  after:none w-full h-[30px] w-[120px]",
                    }}
                    endpoint="imageUploader"
                    content={{
                      button: "Replace image",
                      allowedContent: " ",
                    }}
                    onClientUploadComplete={(res) => {
                      const updatedItems = values.items.map((item, idx) => {
                        if (idx === index) {
                          async () => {
                            if (item.photo && item.photo.length > 0) {
                              await deleteUploadThingImage(item.photo[0].key);
                            }
                          };

                          return {
                            ...item,
                            photo: [
                              ...(item.photo || []),
                              { url: res[0].url, key: res[0].key },
                            ],
                          };
                        }
                        return item;
                      });

                      setFieldValue("items", updatedItems);
                    }}
                    onUploadError={(error: Error) => {
                      alert("error");
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <UploadButton
              appearance={{
                button:
                  "ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed  after:none w-full h-[150px] w-[120px] mt-10",
              }}
              endpoint="imageUploader"
              content={{
                button: "Add image",
                allowedContent: " ",
              }}
              onClientUploadComplete={(res) => {
                const updatedItems = values.items.map((item, idx) => {
                  if (idx === index) {
                    return {
                      ...item,
                      photo: [
                        ...(item.photo || []),
                        { url: res[0].url, key: res[0].key },
                      ],
                    };
                  }
                  return item;
                });

                setFieldValue("items", updatedItems);
              }}
              onUploadError={(error: Error) => {
                alert("error");
              }}
            />
          )}
        </div>

        <div className="text-sm flex flex-col gap-3 items-start w-full">
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

          <div className="w-full">
            <h1 className="text-slate-400 font-bold">Amount</h1>
            {edit ? (
              <input
                className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-slate-400 w-full"
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
                className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-slate-400 w-full"
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
                className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-slate-400 w-full"
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
                  className="text-green-900 text-sm bg-white border-b-[1.5px] bg border-slate-400 w-full"
                  value={item.barcode}
                  onChange={(e) => handleItemChange(e, "barcode")}
                />
                <button
                  type="button"
                  className="border-[1.5px] border-green-900 p-3 rounded-md text-green-900 w-[150px]"
                  onClick={() => {
                    setShowScanner(true);
                    setIsBarcode(false);
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
