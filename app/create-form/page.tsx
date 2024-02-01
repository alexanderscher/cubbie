"use client";

import RegularButton from "@/app/components/buttons/RegularButton";
import { useIsMobile } from "@/utils/useIsMobile";
import { Formik } from "formik";
import React, { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import Image from "next/image";
import { BarcodeScanner } from "@/app/components/BarcodeScanner";

enum ReceiptStage {
  RECEIPT = "RECEIPT",
  ITEMS = "ITEMS",
  PREVIEW = "PREVIEW",
}

interface ItemInput {
  description: string;
  photo: [{ url: string; key: string }];
  price: number;
  barcode: string;
}

interface Image {
  url: string;
  key: string;
}

interface ReceiptInput {
  store: string;
  receiptNumber: string;
  card: string;
  amount: "";
  boughtDate: string;
  finalReturnDate: string;
  receiptImage: Image[];
  items: ItemInput[];
}

const DEFAULT_INPUT_VALUES: ReceiptInput = {
  store: "",
  receiptNumber: "",
  card: "",
  amount: "",
  boughtDate: "",
  finalReturnDate: "",
  receiptImage: [],
  items: [],
};

const Create = () => {
  const [stage, setStage] = useState<ReceiptStage>(ReceiptStage.RECEIPT);
  const isMobile = useIsMobile();
  const [isBarcode, setIsBarcode] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [receiptImageError, setReceiptImageError] = useState({
    error: false,
    message: "",
  });
  const [itemImageError, setItemImageError] = useState({
    error: false,
    message: "",
  });

  const [item, setItem] = useState({
    description: "",
    photo: [] as Image[],
    price: "",
    barcode: "",
    asset: false,
  });

  const handleItemAdd = (value: any, type: string) => {
    setItem({ ...item, [type]: value });
    console.log(value);
  };

  const addItemToFormik = (setFieldValue: any, values: ReceiptInput) => {
    const currentItems = values.items;
    if (item.photo.length > 0 && item.photo[0].url === "") {
      item.photo = [];
    }

    setFieldValue("items", [...currentItems, item]);

    setItem({
      description: "",
      photo: [],
      price: "",
      barcode: "",
      asset: false,
    });
  };
  const handleStageClick = (stagePage: ReceiptStage) => {
    setStage(stagePage);
  };

  const handleError = (error: any) => {
    // console.error("Scanning error:", error);
  };

  return (
    <div className="flex ">
      <div className="w-full flex flex-col justify-center gap-8">
        <div className="flex justify-between items-center">
          <h1 className="xs:text-3xl text-2xl text-green-900  ">
            Create new receipt
          </h1>
        </div>

        <Formik
          initialValues={DEFAULT_INPUT_VALUES}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleSubmit, setFieldValue, values, handleChange }) => (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-10"
            >
              {(() => {
                switch (stage) {
                  case ReceiptStage.ITEMS:
                    return (
                      <div className="two-tab">
                        <div className="left-tab">
                          <div className="flex flex-col gap-4">
                            <div>
                              <p className="text-sm text-green-900">
                                Description/Title
                              </p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
                                type="description"
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
                                className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
                                type="price"
                                value={item.price}
                                name="price"
                                onChange={(e) => {
                                  handleItemAdd(e.target.value, "price");
                                }}
                              />
                            </div>

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
                                <p className="text-sm text-green-900">
                                  Barcode #
                                </p>
                                <input
                                  className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
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
                                <p className="text-sm text-green-900">
                                  Barcode #
                                </p>
                                <input
                                  className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
                                  type="text"
                                  name="barcode"
                                  value={item.barcode}
                                  onChange={(e) => {
                                    handleItemAdd(e.target.value, "barcode");
                                  }}
                                />
                              </div>
                            )}
                            <div>
                              <UploadButton
                                appearance={{
                                  button:
                                    "mt-2 h-[60px] ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed bg-green-900  after:bg-orange-00 w-full",
                                }}
                                endpoint="imageUploader"
                                content={{
                                  button:
                                    item.photo.length > 0
                                      ? "Replace Image"
                                      : "Add image of item",
                                  allowedContent: receiptImageError.error && (
                                    <div className="">
                                      <p className="text-red-500">
                                        {receiptImageError.message}
                                      </p>
                                    </div>
                                  ),
                                }}
                                onClientUploadComplete={(res) => {
                                  console.log("Files: ", res);

                                  if (item.photo.length === 0) {
                                    handleItemAdd(res, "photo");
                                  } else {
                                    deleteUploadThingImage(item.photo[0].key);
                                    handleItemAdd(res, "photo");
                                  }
                                }}
                                onUploadError={(error: Error) => {
                                  let errorString = "";
                                  if (
                                    error.message ==
                                    "Unable to get presigned urls"
                                  ) {
                                    errorString =
                                      "An error occured, please try  another image";
                                  } else {
                                    errorString = error.message;
                                  }
                                  setReceiptImageError({
                                    error: true,
                                    message: error.message,
                                  });
                                }}
                              />
                            </div>

                            {item.photo.length > 0 && (
                              <div className="w-24 h-24 overflow-hidden relative flex items-center justify-center rounded-md">
                                <button
                                  onClick={() => {
                                    deleteUploadThingImage(item.photo[0].key);
                                    setItem({
                                      ...item,
                                      photo: [],
                                    });
                                  }}
                                  className="absolute top-0 right-0 m-1  bg-green-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"
                                >
                                  X
                                </button>
                                <Image
                                  width={150}
                                  height={150}
                                  src={item.photo[0].url}
                                  alt=""
                                />
                              </div>
                            )}

                            <RegularButton
                              submit
                              styles={"border-green-900 bg-green-900 w-full"}
                              handleClick={() => {
                                addItemToFormik(setFieldValue, values);
                                console.log(values);
                              }}
                            >
                              <p className="text-white text-sm">Add Item</p>
                            </RegularButton>
                          </div>
                          <div className="mobile-form-items">
                            {values.items.map((item, index) => (
                              <div key={index} className="flex gap-4">
                                {item.photo.length > 0 && (
                                  <div className="w-1/4 max-w-[300px]">
                                    <Image
                                      src={item.photo[0]?.url}
                                      alt=""
                                      width={100}
                                      height={100}
                                    />
                                  </div>
                                )}

                                <div>
                                  <p>{item.description}</p>
                                  <p>{item.barcode}</p>
                                  <p>{item.price}</p>
                                  {/* <button
                                    onClick={() => {
                                      const currentItems = values.items;
                                      currentItems.splice(index, 1);
                                      setFieldValue("items", currentItems);
                                      deletePhoto(item.photo[0].key);
                                    }}
                                  >
                                    remove
                                  </button> */}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between gap-4">
                            <RegularButton
                              submit
                              styles={
                                "bg-orange-400 border-green-900 w-1/2 max-w-[200px]"
                              }
                              handleClick={() =>
                                handleStageClick(ReceiptStage.RECEIPT)
                              }
                            >
                              <p className="text-green-900 text-sm">
                                Back: Receipt
                              </p>
                            </RegularButton>
                            <RegularButton
                              submit
                              styles={
                                "bg-orange-400 border-green-900  w-1/2 max-w-[200px]"
                              }
                              handleClick={() =>
                                handleStageClick(ReceiptStage.PREVIEW)
                              }
                            >
                              <p className="text-green-900  text-sm">
                                Preview Receipt
                              </p>
                            </RegularButton>
                          </div>
                        </div>

                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                        />
                      </div>
                    );
                  case ReceiptStage.PREVIEW:
                    return (
                      <div className="flex flex-col gap-6">
                        <div className="receipts ">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 receipt-bar">
                              <h1 className="text-green-900 text-2xl ">
                                {values.store}
                              </h1>

                              <div className="receipt-info">
                                <h1 className="text-slate-500">
                                  Number of items
                                </h1>
                                <h1 className="">{values.items.length}</h1>
                              </div>
                              <div className="receipt-info">
                                <h1 className="text-slate-500">Total Amount</h1>
                                <h1 className="">{values.amount}</h1>
                              </div>

                              <div className="receipt-info">
                                <h1 className="text-slate-500">
                                  Date of purchase
                                </h1>
                                <h1 className=""> {values.boughtDate}</h1>
                              </div>
                              <div className="receipt-info">
                                <h1 className="text-slate-500">Return Date</h1>
                                <h1 className=""> {values.finalReturnDate}</h1>
                              </div>
                            </div>{" "}
                            {values.receiptImage.length > 0 && (
                              <Image
                                width={200}
                                height={200}
                                src={values.receiptImage[0].url}
                                alt=""
                              />
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-10 receipt-grid mb-[100px]">
                            {values.items.map((item, index) => (
                              <div key={index}>
                                <ReceiptFormItems
                                  item={item}
                                  index={index}
                                  setFieldValue={setFieldValue}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        {isMobile && (
                          <div className=" flex flex-col gap-6">
                            <div className="flex justify-between gap-3">
                              <RegularButton
                                styles={"bg-orange-400 border-green-900 w-full"}
                                submit
                                handleClick={() =>
                                  handleStageClick(ReceiptStage.RECEIPT)
                                }
                              >
                                <p className="text-green-900 text-sm">
                                  Edit receipt
                                </p>
                              </RegularButton>
                              <RegularButton
                                styles={"bg-orange-400 border-green-900 w-full"}
                                submit
                                handleClick={() =>
                                  handleStageClick(ReceiptStage.ITEMS)
                                }
                              >
                                <p className="text-green-900  text-sm">
                                  Edit receipt items
                                </p>
                              </RegularButton>
                            </div>
                            <RegularButton
                              submit
                              styles={"bg-green-900 border-green-900 "}
                              handleClick={() => handleSubmit()}
                            >
                              <p className="text-white ">Submit</p>
                            </RegularButton>
                          </div>
                        )}
                        {!isMobile && (
                          <div className="fixed bottom-0 left-0 border-t-[1.5px] border-green-800 bg-white w-full p-4 flex justify-between">
                            <div className="flex justify-between gap-3">
                              <RegularButton
                                styles={"bg-orange-400 border-green-900 "}
                                handleClick={() =>
                                  handleStageClick(ReceiptStage.RECEIPT)
                                }
                              >
                                <p className="text-green-900 text-sm">
                                  Edit receipt
                                </p>
                              </RegularButton>
                              <RegularButton
                                styles={"bg-orange-400 border-green-900 "}
                                handleClick={() =>
                                  handleStageClick(ReceiptStage.ITEMS)
                                }
                              >
                                <p className="text-green-900  text-sm">
                                  Edit receipt items
                                </p>
                              </RegularButton>
                            </div>
                            <RegularButton
                              styles={"bg-green-900 border-green-900 "}
                              handleClick={() => handleSubmit()}
                            >
                              <p className="text-white text-sm">Submit</p>
                            </RegularButton>
                          </div>
                        )}
                      </div>
                    );

                  default:
                    return (
                      <div className="two-tab">
                        <div className="left-tab">
                          <h1>Receipt</h1>
                          <div className="flex flex-col gap-4">
                            <div>
                              <p className="text-sm text-green-900">Store</p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
                                type="store"
                                name="store"
                                value={values.store}
                                onChange={handleChange("store")}
                              />
                            </div>

                            <div>
                              <p className="text-sm text-green-900">Amount</p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
                                type="amount"
                                name="amount"
                                value={values.amount}
                                onChange={handleChange("amount")}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-green-900">Card</p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
                                type="card"
                                name="card"
                                value={values.card}
                                onChange={handleChange("card")}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-green-900">
                                Purchase Date
                              </p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
                                type="boughtDate"
                                name="boughtDate"
                                value={values.boughtDate}
                                onChange={handleChange("boughtDate")}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-green-900">
                                Return Date
                              </p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-1 rounded-md focus:outline-none"
                                type="finalReturnDate"
                                value={values.finalReturnDate}
                                onChange={handleChange("finalReturnDate")}
                              />
                            </div>
                            <div className="w-full">
                              <UploadButton
                                appearance={{
                                  button:
                                    "mt-2 h-[60px] ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed bg-green-900  after:bg-orange-00 w-full ",
                                }}
                                endpoint="imageUploader"
                                content={{
                                  button:
                                    values.receiptImage.length > 0
                                      ? "Replace Image"
                                      : "Add image of receipt",
                                  allowedContent: itemImageError.error && (
                                    <div className="">
                                      <p className="text-red-500">
                                        {itemImageError.message}
                                      </p>
                                    </div>
                                  ),
                                }}
                                onClientUploadComplete={(res) => {
                                  console.log("Files: ", res);
                                  if (values.receiptImage.length === 0) {
                                    setFieldValue("receiptImage", res);
                                  } else {
                                    deleteUploadThingImage(
                                      values.receiptImage[0].key
                                    );
                                    setFieldValue("receiptImage", res);
                                  }
                                }}
                                onUploadError={(error: Error) => {
                                  let errorString = "";
                                  if (
                                    error.message ==
                                    "Unable to get presigned urls"
                                  ) {
                                    errorString =
                                      "An error occured, please try  another image";
                                  } else {
                                    errorString = error.message;
                                  }
                                  setItemImageError({
                                    error: true,
                                    message: errorString,
                                  });
                                }}
                              />
                            </div>
                            {values.receiptImage.length > 0 && (
                              <div className="w-24 h-24 overflow-hidden relative flex items-center justify-center rounded-md">
                                <button
                                  onClick={() => {
                                    deleteUploadThingImage(
                                      values.receiptImage[0].key
                                    );
                                    setFieldValue("receiptImage", []);
                                  }}
                                  className="absolute top-0 right-0 m-1  bg-green-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs"
                                >
                                  X
                                </button>
                                <Image
                                  width={150}
                                  height={150}
                                  src={values.receiptImage[0].url}
                                  alt=""
                                />
                              </div>
                            )}
                          </div>

                          <RegularButton
                            submit
                            styles={"bg-orange-400 border-green-900 w-full"}
                            handleClick={() => {
                              handleStageClick(ReceiptStage.ITEMS);
                            }}
                          >
                            <p className="text-green-900 ">
                              Next: Receipt items
                            </p>
                          </RegularButton>
                        </div>
                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                        />
                      </div>
                    );
                }
              })()}
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Create;

interface PreviewProps {
  values: ReceiptInput;
  setFieldValue: any;
}

const Preview = ({ values, setFieldValue }: PreviewProps) => {
  const removeItem = (index: number) => {
    const newItems = values.items.filter((_, i: number) => i !== index);
    setFieldValue("items", newItems);
  };
  return (
    <div className="flex flex-col gap-6 w-3/4  preview border-l-[1.5px] border-green-900 pl-4 ">
      <div className="flex  gap-4">
        <div className="flex flex-col gap-10 w-1/4 min-w-[200px]">
          <div className="flex flex-col gap-4 receipt-bar">
            {values.store ? (
              <h1 className="text-green-900 text-2xl ">{values.store}</h1>
            ) : (
              <h1 className="text-green-900 text-2xl ">Store</h1>
            )}

            <div className="receipt-info">
              <h1 className="text-slate-500">Total Amount</h1>
              <h1 className="">{values.amount}</h1>
            </div>
            <div className="receipt-info">
              <h1 className="text-slate-500">Card</h1>
              <h1 className="">{values.card}</h1>
            </div>

            <div className="receipt-info">
              <h1 className="text-slate-500">Date of purchase</h1>
              <h1 className=""> {values.boughtDate}</h1>
            </div>
            <div className="receipt-info">
              <h1 className="text-slate-500">Return Date</h1>
              <h1 className=""> {values.finalReturnDate}</h1>
            </div>
          </div>
          {values.receiptImage.length > 0 && (
            <div className="w-full">
              <Image
                width={150}
                height={150}
                src={values.receiptImage[0].url}
                alt=""
              />
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          {values.items.map((item, index) => (
            <div key={index}>
              <ReceiptFormItems
                removeItem={removeItem}
                item={item}
                setFieldValue={setFieldValue}
                index={index}
                edit
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface ReceiptFormItemsProps {
  item: any;
  setFieldValue: any;
  index: number;
  removeItem?: any;
  edit?: boolean;
}

const ReceiptFormItems = ({
  item,
  index,
  removeItem,
  edit = false,
}: ReceiptFormItemsProps) => {
  return (
    <div className="border-t-[1.5px] border-black flex flex-col gap-4 ">
      <div className="flex justify-between">
        <h1 className="text-lg text-orange-500">{item.description}</h1>
      </div>
      <div className="flex gap-6 ">
        <div className="w-24 h-32 overflow-hidden relative flex items-center justify-center rounded-md">
          {item.photo.length > 0 && (
            <Image src={item.photo[0].url} width={100} height={100} alt="img" />
          )}
        </div>

        <div className="text-sm flex flex-col gap-3 items-start">
          <div>
            <h1 className="text-slate-400 font-bold">Amount</h1>
            <h1>{item.price}</h1>
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Barcode</h1>
            <h1>{item.barcode}</h1>
          </div>
          {edit && (
            <button
              onClick={() => {
                removeItem(index);
              }}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
