"use client";

import RegularButton from "@/app/components/buttons/RegularButton";
import { useIsMobile } from "@/utils/useIsMobile";
import { Formik } from "formik";
import React, { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import Image from "next/image";
import { BarcodeScanner } from "@/app/components/BarcodeScanner";
import LargeButton from "@/app/components/buttons/LargeButton";
import TextGpt from "@/app/components/chatgpt/TextGpt";
import ImageGpt from "@/app/components/chatgpt/ImageGpt";

enum ReceiptStage {
  METHOD = "METHOD",
  ONLINE_RECEIPT = "ONLINE_RECEIPT",
  ONLINE_ITEMS = "ONLINE_ITEMS",
  IN_STORE_RECEIPT = "IN_STORE_RECEIPT",
  PREVIEW = "PREVIEW",
}

interface ItemInput {
  description: string;
  photo: [{ url: string; key: string }];
  price: number;
  barcode: string;
  asset: boolean;
}

interface Image {
  url: string;
  key: string;
}

interface ReceiptInput {
  type: string;
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
  type: "",
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
  const isMobile = useIsMobile();
  const [stage, setStage] = useState<ReceiptStage>(ReceiptStage.METHOD);
  const [onlineType, setOnlineType] = useState("gpt");

  return (
    <div className="flex ">
      <div className="w-full flex flex-col gap-8 ">
        <Formik
          initialValues={DEFAULT_INPUT_VALUES}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({
            handleSubmit,
            setFieldValue,
            values,
            handleChange,
            resetForm,
          }) => (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-10 "
            >
              <div className="flex justify-between items-center">
                <h1 className="sm:text-3xl text-2xl text-green-900 ">
                  Create New Receipt
                </h1>
                {stage !== ReceiptStage.METHOD && (
                  <RegularButton
                    submit
                    styles="bg border-green-900"
                    handleClick={() => {
                      {
                        setStage(ReceiptStage.METHOD);
                        resetForm({ values: DEFAULT_INPUT_VALUES });
                      }
                    }}
                  >
                    <p className="text-green-900 text-sm">Discard</p>
                  </RegularButton>
                )}
              </div>
              {(() => {
                switch (stage) {
                  case ReceiptStage.METHOD:
                    return (
                      <div
                        className="flex flex-col h-full justify-center items-center"
                        style={{ height: "calc(100vh - 250px)" }}
                      >
                        <div className="w-[600px] gap-8 flex flex-col justify-center items-center">
                          <div className="flex justify-start w-full">
                            <h1 className="text-2xl items-start text-green-800">
                              Choose Receipt Type
                            </h1>
                          </div>

                          <div className="flex w-full gap-7">
                            <LargeButton
                              styles={"h-[200px] bg-green-100"}
                              handleClick={() => {
                                setFieldValue("type", "online");
                                setStage(ReceiptStage.ONLINE_RECEIPT);
                                // if (values.type !== "online") {
                                //   resetForm({ values: DEFAULT_INPUT_VALUES });
                                // }
                              }}
                            >
                              <p>Online</p>
                            </LargeButton>
                            <LargeButton
                              styles={"h-[200px] bg-green-100"}
                              handleClick={() => {
                                setFieldValue("type", "store");
                                setStage(ReceiptStage.IN_STORE_RECEIPT);

                                // if (values.type !== "store") {
                                //   resetForm({ values: DEFAULT_INPUT_VALUES });
                                // }
                              }}
                            >
                              <p>In Store</p>
                            </LargeButton>
                            <LargeButton styles={"h-[200px] bg-green-100"}>
                              <p>Edit Existing Receipt</p>
                            </LargeButton>
                          </div>
                        </div>
                      </div>
                    );
                  case ReceiptStage.ONLINE_RECEIPT:
                    return (
                      <div className="two-tab ">
                        <div className="left-tab">
                          <div className="flex justify-between">
                            <h1>Online Receipt</h1>
                            <RegularButton
                              styles={
                                "border-orange-400 text-orange-400 text-sm"
                              }
                            >
                              <p> {values.type}</p>
                            </RegularButton>
                          </div>

                          <div className="flex flex-col gap-4">
                            <div>
                              <p className="text-sm text-green-900">Store</p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
                                name="store"
                                value={values.store}
                                onChange={handleChange("store")}
                              />
                            </div>

                            <div>
                              <p className="text-sm text-green-900">Amount</p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
                                name="amount"
                                value={values.amount}
                                onChange={handleChange("amount")}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-green-900">Card</p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
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
                                className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
                                name="boughtDate"
                                value={values.boughtDate}
                                onChange={handleChange("boughtDate")}
                                type="date"
                              />
                            </div>
                            <div>
                              <p className="text-sm text-green-900">
                                Return Date
                              </p>
                              <input
                                className="w-full bg border-[1.5px] border-green-900 p-2 rounded-md focus:outline-none"
                                type="date"
                                value={values.finalReturnDate}
                                onChange={handleChange("finalReturnDate")}
                              />
                            </div>
                            <div className="w-full">
                              <UploadButton
                                appearance={{
                                  button:
                                    "mt-3 ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed bg-green-900  after:bg-orange-00 w-full h-[100px]",
                                }}
                                endpoint="imageUploader"
                                content={
                                  {
                                    // button:
                                    //   values.receiptImage.length > 0
                                    //     ? "Replace Image"
                                    //     : "Add image of receipt",
                                    // allowedContent: itemImageError.error && (
                                    //   <div className="">
                                    //     <p className="text-red-500">
                                    //       {itemImageError.message}
                                    //     </p>
                                    //   </div>
                                    // ),
                                  }
                                }
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
                                  // let errorString = "";
                                  // if (
                                  //   error.message ==
                                  //   "Unable to get presigned urls"
                                  // ) {
                                  //   errorString =
                                  //     "An error occured, please try  another image";
                                  // } else {
                                  //   errorString = error.message;
                                  // }
                                  // setItemImageError({
                                  //   error: true,
                                  //   message: errorString,
                                  // });
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
                                  className="absolute top-0 right-0 m-1  bg-green-900 text-white rounded-full h-6 w-6 flex items-center justify-center text-sm"
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

                          <div className="flex gap-2">
                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStage.METHOD);
                              }}
                            >
                              <p className="text-green-900 ">
                                Back: Receipt type
                              </p>
                            </RegularButton>

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStage.ONLINE_ITEMS);
                              }}
                            >
                              <p className="text-green-900 ">
                                Next: Receipt items
                              </p>
                            </RegularButton>
                          </div>
                        </div>
                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                          handleChange={handleChange}
                        />
                      </div>
                    );
                  case ReceiptStage.ONLINE_ITEMS:
                    return (
                      <div className="two-tab ">
                        <div className="left-tab">
                          <div className="flex justify-between">
                            <h1>Online Receipt Items</h1>
                            <RegularButton
                              styles={
                                "border-orange-400 text-orange-400 text-sm"
                              }
                            >
                              <p> {values.type}</p>
                            </RegularButton>
                          </div>
                          <div className="w-full flex justify-between">
                            <RegularButton
                              styles={`${
                                onlineType === "manual"
                                  ? "bg-black text-white"
                                  : "text-black"
                              } border-black`}
                              handleClick={() => setOnlineType("manual")}
                            >
                              <p className=" text-sm">Add Items Manually</p>
                            </RegularButton>

                            <RegularButton
                              styles={`${
                                onlineType === "gpt"
                                  ? "bg-black text-white"
                                  : "text-black"
                              } border-black`}
                              handleClick={() => setOnlineType("gpt")}
                            >
                              <p className=" text-sm">Analyze online receipt</p>
                            </RegularButton>
                          </div>
                          {onlineType === "gpt" ? (
                            <TextGpt setFieldValue={setFieldValue} />
                          ) : (
                            <OnlineReceiptManual
                              setFieldValue={setFieldValue}
                              values={values}
                            />
                          )}

                          <div className="flex gap-2 ">
                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStage.ONLINE_RECEIPT);
                              }}
                            >
                              <p className="text-green-900 ">Back: Receipt</p>
                            </RegularButton>

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStage.PREVIEW);
                              }}
                            >
                              <p className="text-green-900 ">Preview</p>
                            </RegularButton>
                          </div>
                        </div>
                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                          handleChange={handleChange}
                        />
                      </div>
                    );

                  case ReceiptStage.IN_STORE_RECEIPT:
                    return (
                      <div className="two-tab ">
                        <div className="left-tab">
                          <div className="flex justify-between">
                            <h1 className="text-lg ">In Store Receipt</h1>
                            <RegularButton
                              styles={
                                "border-orange-400 text-orange-400 text-sm"
                              }
                            >
                              <p> {values.type}</p>
                            </RegularButton>
                          </div>
                          <ImageGpt
                            setFieldValue={setFieldValue}
                            values={values}
                          />
                          {/* <div className="mobile-form-items ">
                            {values.items.map((item, index) => (
                              <div key={index} className="flex gap-4 w-full">
                                <ReceiptFormItems
                                  item={item}
                                  setFieldValue={setFieldValue}
                                  index={index}
                                  values={values}
                                />
                              </div>
                            ))}
                          </div> */}
                          <div className="flex gap-2">
                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStage.METHOD);
                              }}
                            >
                              <p className="text-green-900 ">
                                Back: Receipt type
                              </p>
                            </RegularButton>

                            <RegularButton
                              submit
                              styles={"bg-orange-400 border-green-900 w-full"}
                              handleClick={() => {
                                setStage(ReceiptStage.PREVIEW);
                              }}
                            >
                              <p className="text-green-900 ">Preview</p>
                            </RegularButton>
                          </div>
                        </div>

                        <Preview
                          setFieldValue={setFieldValue}
                          values={values}
                          handleChange={handleChange}
                        />
                      </div>
                    );
                  case ReceiptStage.PREVIEW:
                    return (
                      <div className="flex flex-col gap-6">
                        <div className="receipts ">
                          <div className="flex flex-col gap-4">
                            <h1>Preview Receipt</h1>
                            <div className="flex flex-col gap-4 receipt-bar">
                              <h1 className="text-green-900 text-2xl ">
                                {values.store}
                              </h1>
                              {/* <RegularButton
                                styles={
                                  "border-orange-400 text-orange-400 text-sm"
                                }
                              >
                                <p> {values.type}</p>
                              </RegularButton> */}

                              <div className="receipt-info">
                                <h1 className="text-slate-500 font-bold text-sm">
                                  Number of items
                                </h1>
                                <h1 className="">{values.items.length}</h1>
                              </div>
                              <div className="receipt-info">
                                <h1 className="text-slate-500 font-bold text-sm">
                                  Total Amount
                                </h1>
                                <h1 className="">{values.amount}</h1>
                              </div>

                              <div className="receipt-info">
                                <h1 className="text-slate-500 font-bold text-sm">
                                  Date of purchase
                                </h1>
                                <h1 className=""> {values.boughtDate}</h1>
                              </div>
                              <div className="receipt-info">
                                <h1 className="text-slate-500 font-bold text-sm">
                                  Return Date
                                </h1>
                                <h1 className=""> {values.finalReturnDate}</h1>
                              </div>
                            </div>{" "}
                            {values.receiptImage.length > 0 && (
                              <div className="w-24 h-24 overflow-hidden relative flex items-center justify-center rounded-md">
                                <Image
                                  width={200}
                                  height={200}
                                  src={values.receiptImage[0].url}
                                  alt=""
                                />
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-10 receipt-grid mb-[100px]">
                            {values.items.map((item, index) => (
                              <div key={index}>
                                <ReceiptFormItems
                                  item={item}
                                  values={values}
                                  index={index}
                                  setFieldValue={setFieldValue}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        {isMobile && (
                          <div className=" flex flex-col gap-6 pb-[200px]">
                            <div className="flex justify-between gap-3">
                              <RegularButton
                                styles={"bg-orange-400 border-green-900 w-full"}
                                submit
                                handleClick={() => {
                                  if (values.type === "online") {
                                    setStage(ReceiptStage.ONLINE_RECEIPT);
                                  }
                                  if (values.type === "store") {
                                    setStage(ReceiptStage.IN_STORE_RECEIPT);
                                  }
                                }}
                              >
                                <p className="text-green-900 text-sm">
                                  Edit receipt
                                </p>
                              </RegularButton>
                              {values.type === "online" && (
                                <RegularButton
                                  styles={
                                    "bg-orange-400 border-green-900 w-full"
                                  }
                                  submit
                                  // handleClick={() => setStage(ReceiptStage.ITEMS)}
                                >
                                  <p className="text-green-900  text-sm">
                                    Edit receipt items
                                  </p>
                                </RegularButton>
                              )}
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
                                handleClick={() => {
                                  if (values.type === "online") {
                                    setStage(ReceiptStage.ONLINE_RECEIPT);
                                  }
                                  if (values.type === "store") {
                                    setStage(ReceiptStage.IN_STORE_RECEIPT);
                                  }
                                }}
                              >
                                <p className="text-green-900 text-sm">
                                  Edit receipt
                                </p>
                              </RegularButton>
                              {values.type === "online" && (
                                <RegularButton
                                  styles={"bg-orange-400 border-green-900 "}
                                  handleClick={() =>
                                    setStage(ReceiptStage.ONLINE_ITEMS)
                                  }
                                >
                                  <p className="text-green-900  text-sm">
                                    Edit receipt items
                                  </p>
                                </RegularButton>
                              )}
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

const OnlineReceiptManual = ({ setFieldValue, values }: any) => {
  const [showScanner, setShowScanner] = useState(false);
  const [isBarcode, setIsBarcode] = useState(false);

  const [item, setItem] = useState({
    description: "",
    photo: [] as Image[],
    price: "",
    barcode: "",
    asset: false,
  });
  const handleItemAdd = (value: any, type: string) => {
    setItem({ ...item, [type]: value });
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
          value={item.price}
          name="price"
          onChange={(e) => {
            handleItemAdd(e.target.value, "price");
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
              "ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed bg-green-900  after:bg-orange-00 w-full h-[100px]",
          }}
          endpoint="imageUploader"
          // content={{
          //   button: "Add image of item",
          //   allowedContent: receiptImageError.error && (
          //     <div className="">
          //       <p className="text-red-500">
          //         {receiptImageError.message}
          //       </p>
          //     </div>
          //   ),
          // }}
          onClientUploadComplete={(res) => {
            console.log("Files: ", res);

            if (item.photo.length === 0) {
              handleItemAdd(res, "photo");
            } else {
              deleteUploadThingImage(item.photo[0].key);
              handleItemAdd(res, "photo");
            }
          }}
          // onUploadError={(error: Error) => {
          //   setReceiptImageError({
          //     error: true,
          //     message: error.message,
          //   });
          // }}
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
          console.log(values);
        }}
      >
        <p className="text-white text-sm">Add Item</p>
      </RegularButton>
    </div>
  );
};

interface PreviewProps {
  values: ReceiptInput;
  setFieldValue: any;
  handleChange: any;
}
const Preview = ({ values, setFieldValue, handleChange }: PreviewProps) => {
  const [edit, setEdit] = useState(false);
  const toggleEdit = () => {
    setEdit(!edit);
  };

  return (
    <div className="flex flex-col gap-6 preview pb-[200px]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 ">
            {edit ? (
              <div className="flex justify-between">
                <input
                  className="text-green-900 text-xl bg-white border-b-[1.5px] border-green-900"
                  name="store"
                  value={values.store}
                  onChange={handleChange}
                />
                <button onClick={toggleEdit} className="mb-4">
                  {edit ? "Save Changes" : "Edit"}
                </button>
              </div>
            ) : (
              <div className="flex justify-between">
                <h1 className="text-green-900 text-2xl">
                  {values.store || "Store Name"}
                </h1>
                <button onClick={toggleEdit} className="mb-4">
                  {edit ? "Save Changes" : "Edit"}
                </button>
              </div>
            )}

            <div className="flex flex-col ">
              <h1 className="text-slate-500 font-bold text-sm">Total Amount</h1>
              {edit ? (
                <input
                  className="text-green-900 text-sm bg-white border-b-[1.5px] border-green-900"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                />
              ) : (
                <h1 className="text-green-900 text-sm">{values.amount}</h1>
              )}
            </div>

            <div className="flex flex-col ">
              <h1 className="text-slate-500 font-bold text-sm">Card</h1>
              {edit ? (
                <input
                  className="text-green-900 text-sm bg-white border-b-[1.5px] border-green-900"
                  name="card"
                  value={values.card}
                  onChange={handleChange}
                />
              ) : (
                <h1 className="text-green-900 text-sm">{values.card}</h1>
              )}
            </div>

            <div className="flex flex-col ">
              <h1 className="text-slate-500 font-bold text-sm">
                Date of Purchase
              </h1>
              {edit ? (
                <input
                  className="text-green-900 text-sm bg-white border-b-[1.5px] border-green-900"
                  name="boughtDate"
                  value={values.boughtDate}
                  onChange={handleChange}
                  type="date" // Assuming the date format needs to be validated
                />
              ) : (
                <h1 className="text-green-900 text-sm">{values.boughtDate}</h1>
              )}
            </div>

            <div className="flex flex-col ">
              <h1 className="text-slate-500 font-bold text-sm">Return Date</h1>
              {edit ? (
                <input
                  className="text-green-900 text-sm bg-white border-b-[1.5px] border-green-900"
                  name="finalReturnDate"
                  value={values.finalReturnDate}
                  onChange={handleChange}
                  type="date" // Assuming the date format needs to be validated
                />
              ) : (
                <h1 className="text-green-900 text-sm">
                  {values.finalReturnDate}
                </h1>
              )}
            </div>
          </div>

          {values.receiptImage.length > 0 && (
            <div className="w-full flex justify-end">
              {/* Placeholder for image display */}
              <div className="w-24 h-50 overflow-hidden relative flex items-center justify-center rounded-md">
                {/* Assuming you have a component or method to display images */}
                <Image
                  width={150}
                  height={150}
                  src={values.receiptImage[0].url}
                  alt=""
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          {values.items.map((item, index) => (
            <div key={index}>
              <ReceiptFormItems
                item={item}
                index={index}
                setFieldValue={setFieldValue}
                values={values}
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

  const removeItem = (index: number) => {
    const newItems = values.items.filter((_, i: number) => i !== index);
    setFieldValue("items", newItems);
  };

  const handleItemChange = (e: any, field: any) => {
    const newItems = [...values.items];
    newItems[index] = { ...newItems[index], [field]: e.target.value };
    setFieldValue("items", newItems);
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
              className="text-lg text-orange-500"
              value={item.description}
              onChange={(e) => handleItemChange(e, "description")}
            />
            <h1
              className="text-lg text-orange-500"
              onClick={() => setEdit(false)}
            >
              Done
            </h1>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <h1 className="text-lg text-orange-500">{item.description}</h1>
            <h1
              className="text-lg text-orange-500"
              onClick={() => setEdit(true)}
            >
              Edit
            </h1>
          </div>
        )}
      </div>

      <div className="flex gap-6 ">
        <div className="text-sm flex flex-col gap-3 items-start">
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
          <div>
            <h1 className="text-slate-400 font-bold">Amount</h1>
            {edit ? (
              <input
                value={item.price}
                onChange={(e) => handleItemChange(e, "price")}
              />
            ) : (
              <h1>{item.price}</h1>
            )}
          </div>
          <div>
            <h1 className="text-slate-400 font-bold">Barcode</h1>
            {edit ? (
              <input
                value={item.barcode}
                onChange={(e) => handleItemChange(e, "barcode")}
              />
            ) : (
              <h1>{item.barcode}</h1>
            )}
          </div>

          <button onClick={() => removeItem(index)}>Remove</button>
        </div>
      </div>
    </div>
  );
};
