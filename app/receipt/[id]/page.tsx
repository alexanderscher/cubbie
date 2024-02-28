"use client";
import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderNav from "@/app/components/navbar/HeaderNav";
import ImageModal from "@/app/components/images/ImageModal";
import { ReceiptItems } from "@/app/components/ReceiptItems";
import CurrencyInput from "react-currency-input-field";
import * as Yup from "yup";
import { BarcodeScanner } from "@/app/components/createForm/barcode/BarcodeScanner";

const ReceiptPage = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState({} as ReceiptType);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const idString = id as string;

  useEffect(() => {
    const fetchReceipt = async () => {
      const res = await fetch(`/api/receipt/${id}`);
      const data = await res.json();
      setReceipt(data.receipt);
    };
    fetchReceipt();
  }, [id]);
  console.log(receipt);

  if (!receipt.items) return <div className="min-h-screen">Loading</div>;
  return (
    <div className="flex flex-col gap-8  w-full h-fullå ">
      <HeaderNav receipt={receipt} />
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl text-orange-600 w-3/4">{receipt.store}</h1>
        <div className="flex gap-2">
          <RegularButton
            styles="bg-emerald-900"
            handleClick={() => setIsAddOpen(true)}
          >
            <p className="text-white text-xs">Add item</p>
          </RegularButton>
          <RegularButton
            styles="bg-emerald-900"
            href={`/receipt/${receipt.id}/edit`}
          >
            <p className="text-white text-xs">Edit</p>
          </RegularButton>
        </div>
      </div>
      {isAddOpen && <AddItemModal setIsAddOpen={setIsAddOpen} id={idString} />}
      <div className="flex bg-white  rounded-lg text-sm shadow p-4">
        <div className="w-1/3 border-r-[1px] border-slate-300 ">
          <p className="text-slate-400 text-xs">Total amount</p>
          <p>
            {formatCurrency(
              receipt.items.reduce((acc: number, curr: Item) => {
                return acc + curr.price;
              }, 0)
            )}
          </p>
        </div>
        <div className="w-1/3 border-r-[1px] border-slate-300 pl-2 pr-2">
          <p className="text-slate-400 text-xs">Purchase Date</p>
          <p>{formatDateToMMDDYY(receipt.purchase_date)}</p>
        </div>

        <div className="pl-2 pr-2">
          <p className="text-slate-400 text-xs">Return Date</p>
          <p>{formatDateToMMDDYY(receipt.return_date)}</p>
        </div>
      </div>
      <div className={`${styles.receipt} `}>
        <div className={`${styles.receiptLeft} shadow  flex flex-col gap-2`}>
          <div
            className={`shadow rounded-lg  bg-white flex flex-col gap-4 p-6   `}
          >
            <p className="text-xl text-emerald-900">Receipt Information</p>
            {!receipt.receipt_image_url && (
              <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                <div className="w-full h-full flex justify-center items-start ">
                  <Image
                    src="/receipt_b.png"
                    alt=""
                    width={40}
                    height={40}
                    className="object-cover bg-white pt-4"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                  />
                </div>
              </div>
            )}

            {receipt.receipt_image_url && (
              <div className="w-full flex justify-center items-center  ">
                <div className=" w-[200px] max-h-[200px]  rounded-lg overflow-hidden">
                  <Image
                    src={receipt.receipt_image_url}
                    width={280}
                    height={280}
                    alt="Receipt Image"
                    className="object-contain rounded-lg cursor-pointer"
                    layout="intrinsic"
                    onClick={() => setIsOpen(true)}
                  />
                </div>
              </div>
            )}
            <ImageModal
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              imageUrl={receipt.receipt_image_url}
              altText="Your Image Description"
            />

            <div className="flex flex-col gap-4 text-sm ">
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Quantity</p>
                <p className="">{receipt.items.length}</p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Created at</p>
                <p className="">{formatDateToMMDDYY(receipt.created_at)}</p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Receipt Type</p>
                <p className="">{receipt.type}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Card</p>
                <p className="">{receipt.card ? receipt.card : "None"}</p>
              </div>

              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Tracking Link</p>
                <p className="">
                  {receipt.tracking_number ? receipt.tracking_number : "None"}
                </p>
              </div>
              <div className="w-full  border-slate-400 border-b-[1px] pb-2 ">
                <p className="text-slate-400 text-xs">Asset Amount</p>
                <p className="">
                  {receipt.asset_amount
                    ? formatCurrency(receipt.asset_amount)
                    : "None"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col gap-2 pb-[200px] ${styles.boxContainer}`}
        >
          {/* <p className="text-lg text-emerald-900">Items</p> */}
          <div className={`${styles.boxes} `}>
            {receipt.items.length > 0 &&
              receipt.items.map((item: any, index: number) => (
                <ReceiptItems
                  key={item.id}
                  item={item}
                  asset_amount={receipt.asset_amount}
                  index={index}
                  length={receipt.items.length}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;

interface AddItemModalProps {
  setIsAddOpen: (value: boolean) => void;
  id: string;
}

const AddItemModal = ({ setIsAddOpen, id }: AddItemModalProps) => {
  const [newItem, setNewItem] = useState({
    description: "",
    price: "",
    barcode: "",
    product_id: "",
    character: "",
    photo: "",
    receipt_id: parseInt(id),
  });

  const addItemToReceipt = async () => {
    const res = await fetch("/api/items", {
      method: "POST",
      body: JSON.stringify(newItem),
    });
    const data = await res.json();
    console.log(data);
  };

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
      addItemToReceipt();
      setIsAddOpen(false);
      setNewItem({
        description: "",
        price: "",
        barcode: "",
        product_id: "",
        character: "",
        photo: "",
        receipt_id: parseInt(id),
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
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full">
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
                className="text-sm bg-white border-[1px] rounded-md p-2  border-emerald-900 focus:outline-none w-full"
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

              <div className="relative w-full h-[70px] overflow-hidden border-[1px] border-dashed rounded-lg bg-slate-100 flex flex-col border-emerald-900 justify-center items-center ">
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
              <div className="w-24 h-24 flex items-center flex-shrink-0 overflow-visible rounded-lg relative">
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
                      className="w-full h-full object-cover rounded-lg"
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
