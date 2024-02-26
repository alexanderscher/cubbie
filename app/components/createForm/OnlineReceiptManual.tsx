import { BarcodeScanner } from "@/app/components/createForm/barcode/BarcodeScanner";
import LargeButton from "@/app/components/buttons/LargeButton";
import RegularButton from "@/app/components/buttons/RegularButton";
import { ItemInput, ReceiptInput } from "@/types/form";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";
import * as Yup from "yup";

import CurrencyInput from "react-currency-input-field";
const itemSchema = Yup.object({
  description: Yup.string().required("Description is required"),
  price: Yup.string().required("Price is required"),
});

interface OnlineReceiptManualProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: ReceiptInput;
}

const OnlineReceiptManual = ({
  setFieldValue,
  values,
}: OnlineReceiptManualProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [isBarcode, setIsBarcode] = useState(false);

  const [error, setError] = useState({
    description: "",
    price: "",
  });

  const [item, setItem] = useState<ItemInput>({
    description: "",
    photo: "",
    price: "",
    barcode: "",
    asset: false,
    character: "",
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!file.type.match("image.*")) {
        alert("Please upload an image file");
        //  setUnvalidImage(true);
        return;
      }

      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setItem({
            ...item,
            photo: reader.result,
          });
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
    }
  };
  const handleItemAdd = (value: any, type: string) => {
    setItem({ ...item, [type]: value });
  };

  const handleCurrencyChange = (value: string | undefined) => {
    setItem({ ...item, price: value || "" });
  };

  const addItemToFormik = async (setFieldValue: any, values: ReceiptInput) => {
    try {
      await itemSchema.validate(item, { abortEarly: false });

      const currentItems = values.items;
      setFieldValue("items", [...currentItems, item]);

      setItem({
        description: "",
        photo: "",
        price: "",
        barcode: "",
        product_id: "",
        asset: false,
        character: "",
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

  const handleError = (error: any) => {
    // console.error("Scanning error:", error);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm text-emerald-900 ">Description/Title</p>

        <input
          className="w-full bg border-[1px] border-emerald-900 p-2 rounded-lg focus:outline-none"
          name="description"
          value={item.description || ""}
          onChange={(e) => {
            handleItemAdd(e.target.value, "description");
          }}
        />
        {error.description && (
          <p className="text-orange-900 text-sm">{error.description}</p>
        )}
      </div>

      <div>
        <p className="text-sm text-emerald-900 ">Price</p>

        <CurrencyInput
          id="price"
          name="price"
          className="w-full bg border-[1px] border-emerald-900 p-2 rounded-lg focus:outline-none"
          placeholder=""
          value={item.price}
          defaultValue={item.price || ""}
          decimalsLimit={2}
          onValueChange={handleCurrencyChange}
        />
        {error.price && (
          <p className="text-orange-900 text-sm">{error.price}</p>
        )}
      </div>
      <div>
        <p className="text-sm text-emerald-900 ">Character</p>
        <input
          className="w-full bg border-[1px] border-emerald-900 p-2 rounded-lg focus:outline-none"
          value={item.character || ""}
          name="character"
          onChange={(e) => {
            handleItemAdd(e.target.value, "character");
          }}
        />
      </div>
      <div>
        <p className="text-sm text-emerald-900 ">Product ID</p>
        <input
          className="w-full bg border-[1px] border-emerald-900 p-2 rounded-lg focus:outline-none"
          value={item.product_id || ""}
          name="product_id"
          onChange={(e) => {
            handleItemAdd(e.target.value, "product_id");
          }}
        />
      </div>
      <p className="text-sm text-emerald-900 ">Barcode</p>

      <div className="flex gap-4">
        <button
          type="button"
          className="border-[1px] border-emerald-900 w-full p-3 rounded-lg text-emerald-900 "
          onClick={() => {
            setShowScanner(true);
            setIsBarcode(false);
          }}
          disabled={showScanner}
        >
          Scan barcode
        </button>
        <button
          type="button"
          className="border-[1px] border-emerald-900 w-full p-3 rounded-lg text-emerald-900 "
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
            type="button"
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
          <p className="text-sm text-emerald-900 ">Barcode #</p>
          <input
            className="w-full bg border-[1px] border-emerald-900 p-2 rounded-lg focus:outline-none"
            type="text"
            name="barcode"
            value={item.barcode || ""}
            onChange={(e) => {
              handleItemAdd(e.target.value, "barcode");
            }}
          />
        </div>
      )}

      {isBarcode && (
        <div>
          <p className="text-sm text-emerald-900 ">Barcode #</p>
          <input
            className="w-full bg border-[1px] border-emerald-900 p-2 rounded-lg focus:outline-none"
            type="text"
            name="barcode"
            value={item.barcode || ""}
            onChange={(e) => {
              handleItemAdd(e.target.value, "barcode");
            }}
          />
        </div>
      )}
      <p className="text-sm text-emerald-900 ">Image of tag or item</p>
      <div className="flex flex-col mb-6">
        <input
          type="file"
          onChange={handleFileChange}
          id="file-upload"
          style={{ opacity: 0, position: "absolute", zIndex: -1 }}
        />
        <LargeButton height="h-[80px]">
          <label
            htmlFor="file-upload"
            className="w-full h-full flex justify-center items-center"
            style={{
              cursor: "pointer",
            }}
          >
            Upload File
          </label>
        </LargeButton>
      </div>

      {item.photo && (
        <div className="w-24 h-24 overflow-hidden relative flex items-center justify-center rounded-md ">
          <button
            type="button"
            onClick={() => {
              setItem({
                ...item,
                photo: "",
              });
            }}
            className="absolute top-0 right-0 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
          >
            X
          </button>
          <Image width={150} height={150} src={item.photo} alt="" />
        </div>
      )}

      <RegularButton
        styles={"border-black  bg-black w-full"}
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
