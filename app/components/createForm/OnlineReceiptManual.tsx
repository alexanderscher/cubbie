import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import { BarcodeScanner } from "@/app/components/BarcodeScanner";
import RegularButton from "@/app/components/buttons/RegularButton";
import { ItemInput, ReceiptInput } from "@/types/formTypes/form";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import React, { useState } from "react";

const OnlineReceiptManual = ({ setFieldValue, values }: any) => {
  const [showScanner, setShowScanner] = useState(false);
  const [isBarcode, setIsBarcode] = useState(false);

  const [item, setItem] = useState<ItemInput>({
    description: "",
    photo: [],
    price: null,
    barcode: "",
    asset: false,
    character: "",
  });
  const handleItemAdd = (value: any, type: string) => {
    setItem({ ...item, [type]: value });
  };
  const addItemToFormik = (setFieldValue: any, values: ReceiptInput) => {
    const currentItems = values.items;
    if (item.photo && item.photo?.length > 0) {
      item.photo = [];
    }

    setFieldValue("items", [...currentItems, item]);

    setItem({
      description: "",
      photo: [],
      price: null,
      barcode: "",
      product_id: "",
      asset: false,
      character: "",
    });
  };

  const handleError = (error: any) => {
    // console.error("Scanning error:", error);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-green-900">Description/Title</p>
        <input
          className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
          name="description"
          value={item.description}
          onChange={(e) => {
            handleItemAdd(e.target.value, "description");
          }}
        />
      </div>

      <div>
        <p className="text-sm text-green-900">Price</p>
        <input
          className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
          value={item.price as number}
          name="price"
          onChange={(e) => {
            handleItemAdd(e.target.value, "price");
          }}
        />
      </div>
      <div>
        <p className="text-sm text-green-900">Character</p>
        <input
          className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
          value={item.character}
          name="character"
          onChange={(e) => {
            handleItemAdd(e.target.value, "character");
          }}
        />
      </div>
      <div>
        <p className="text-sm text-green-900">Product ID</p>
        <input
          className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
          value={item.product_id}
          name="product_id"
          onChange={(e) => {
            handleItemAdd(e.target.value, "product_id");
          }}
        />
      </div>
      <p className="text-sm text-green-900">Barcode</p>

      <div className="flex gap-4">
        <button
          className="border-[1.5px] border-green-900 w-full p-3 rounded-md text-green-900"
          onClick={() => {
            setShowScanner(true);
            setIsBarcode(false);
          }}
          disabled={showScanner}
        >
          Scan barcode
        </button>
        <button
          className="border-[1.5px] border-green-900 w-full p-3 rounded-md text-green-900"
          onClick={() => {
            setShowScanner(false);
            setIsBarcode(!isBarcode);
          }}
        >
          Input barcode
        </button>
      </div>

      {showScanner && (
        <div>
          <h1>Scan a Barcode</h1>
          <BarcodeScanner
            setShowScanner={setShowScanner}
            onResult={(result) => {
              handleItemAdd(result.text, "barcode");
              setShowScanner(false);
            }}
            onError={handleError}
          />
          <button
            onClick={() => {
              setShowScanner(false);
            }}
          >
            Close Scanner
          </button>
        </div>
      )}

      {item.barcode && !isBarcode && (
        <div>
          <p className="text-sm text-green-900">Barcode #</p>
          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            type="text"
            name="barcode"
            value={item.barcode}
            onChange={(e) => {
              handleItemAdd(e.target.value, "barcode");
            }}
          />
        </div>
      )}

      {isBarcode && (
        <div>
          <p className="text-sm text-green-900">Barcode #</p>
          <input
            className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
            type="text"
            name="barcode"
            value={item.barcode}
            onChange={(e) => {
              handleItemAdd(e.target.value, "barcode");
            }}
          />
        </div>
      )}
      <p className="text-sm text-green-900">Image of tag or item</p>
      <div>
        <UploadButton
          appearance={{
            button:
              "ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed   after:none w-full h-[100px]",
          }}
          endpoint="imageUploader"
          // content={{
          //   button: "Add image of item",
          //   allowedContent: receiptImageError.error && (
          //     <div className="">
          //       <p className="text-orange-800">
          //         {receiptImageError.message}
          //       </p>
          //     </div>
          //   ),
          // }}
          onClientUploadComplete={(res) => {
            async () => {
              if (item.photo && item.photo.length === 0) {
                handleItemAdd(res, "photo");
              } else {
                if (item.photo && item.photo.length > 0) {
                  await deleteUploadThingImage(item.photo[0]?.key);
                }

                handleItemAdd(res, "photo");
              }
            };
          }}
          // onUploadError={(error: Error) => {
          //   setReceiptImageError({
          //     error: true,
          //     message: error.message,
          //   });
          // }}
        />
      </div>

      {item.photo && item.photo.length > 0 && (
        <div className="w-24 h-24 overflow-hidden relative flex items-center justify-center rounded-md">
          <button
            onClick={() => {
              async () => {
                if (item.photo && item.photo.length > 0) {
                  await deleteUploadThingImage(item.photo[0].key);
                }
              };

              setItem({
                ...item,
                photo: [],
              });
            }}
            className="absolute top-0 right-0 m-1  bg-green-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
          >
            X
          </button>
          <Image width={150} height={150} src={item.photo[0].url} alt="" />
        </div>
      )}

      <RegularButton
        submit
        styles={"border-green-900 bg-green-900 w-full"}
        handleClick={() => {
          addItemToFormik(setFieldValue, values);
        }}
      >
        <p className="text-white text-sm">Add Item</p>
      </RegularButton>
    </div>
  );
};

export default OnlineReceiptManual;
