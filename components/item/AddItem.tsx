import { addItem } from "@/actions/items/addItem";
import RegularButton from "@/components/buttons/RegularButton";
import { BarcodeScanner } from "@/components/createForm/barcode/BarcodeScanner";
import FileUploadDropzone from "@/components/dropzone/FileUPloadDropzone";
import Loading from "@/components/Loading";
import Image from "next/image";
import { useState, useTransition } from "react";
import CurrencyInput from "react-currency-input-field";
import * as Yup from "yup";

interface AddItemModalProps {
  setIsAddOpen: (value: boolean) => void;
  id: number;
}

export const AddItem = ({ setIsAddOpen, id }: AddItemModalProps) => {
  const [newItem, setNewItem] = useState({
    description: "",
    price: "",
    barcode: "",
    product_id: "",
    character: "",
    photo: "",
    receipt_id: id,
  });

  console.log(newItem);

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
    result: "",
  });

  const itemSchema = Yup.object({
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async () => {
    try {
      await itemSchema.validate(newItem, { abortEarly: false });

      startTransition(async () => {
        const result = await addItem(newItem);

        if (result?.error) {
          setError({ ...error, result: result.error });
        } else {
          setIsAddOpen(false);

          setNewItem({
            description: "",
            price: "",
            barcode: "",
            product_id: "",
            character: "",
            photo: "",
            receipt_id: id,
          });
          setError({
            description: "",
            price: "",
            result: "",
          });
        }
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
          result: string;
        }
      );
    }
  };

  const handleBarcodeResult = (barcodeValue: string) => {
    setNewItem({ ...newItem, barcode: barcodeValue });
  };

  const onFileUpload = (file: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewItem({ ...newItem, photo: reader.result });
      }
    };
    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
    };
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[2000] "
      onClick={(e) => e.preventDefault()}
    >
      <div className="bg-white rounded shadow-xl m-4 max-w-md w-full">
        <div className="flex justify-between items-center border-b  px-5 py-3  rounded-t-lg border-emerald-900">
          <h3 className="text-md text-emerald-900">Add Item</h3>
          <button
            type="button"
            className="text-emerald-900"
            onClick={() => setIsAddOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6 ">
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
                  className="w-[40px] border-[1px] border-emerald-900 p-4 rounded-md flex justify-center items-center  "
                  onClick={() => {
                    setShowScanner(true);
                  }}
                  disabled={showScanner}
                >
                  <Image
                    src="/barcode_b.png"
                    alt="barcode"
                    width={400}
                    height={400}
                  ></Image>
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
              <div>
                <p className="text-xs text-emerald-900">Image</p>

                <FileUploadDropzone onFileUpload={onFileUpload} />
              </div>
            </div>
            <div>
              {newItem.photo && (
                <div className="w-24 h-24 relative">
                  <div className="w-24 h-24 overflow-hidden flex items-center justify-center rounded-md border-[1px] border-emerald-900">
                    <button
                      type="button"
                      onClick={() => {
                        setNewItem({ ...newItem, photo: "" });
                      }}
                      className="absolute -top-2  -right-2 m-1  bg-emerald-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
                    >
                      X
                    </button>
                    <Image
                      width={150}
                      height={150}
                      src={newItem.photo}
                      alt=""
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <RegularButton
              type="button"
              styles=" border-emerald-900"
              handleClick={handleSubmit}
            >
              <p className="text-xs text-emerald-900">Add Item</p>
            </RegularButton>
          </div>
        </div>
      </div>
      {isPending && <Loading loading={isPending} />}
    </div>
  );
};
