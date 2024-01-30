"use client";
import ReceiptItems from "@/app/components/ReceiptItems";
import RegularButton from "@/app/components/buttons/RegularButton";
import { useIsMobile } from "@/utils/useIsMobile";
import { Formik } from "formik";
import React, { useState } from "react";
import { UploadButton } from "@/utils/uploadthing";
import ImageUploader from "@/app/components/chatgpt/ImageUploader";
import { deleteUploadThingImage } from "@/app/actions/deletePhoto";
import Image from "next/image";

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

  const [item, setItem] = useState({
    description: "",
    photo: [
      {
        url: "",
        key: "",
      },
    ],
    price: "",
    barcode: "",
    asset: false,
  });

  const handleItemAdd = (value: any, type: string) => {
    setItem({ ...item, [type]: value });
  };
  const addItemToFormik = (setFieldValue: any, values: ReceiptInput) => {
    const currentItems = values.items;
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

  const deletePhoto = async (img: string) => {
    deleteUploadThingImage(img);
  };

  return (
    <div className="flex ">
      <div className="w-full flex flex-col justify-center gap-8">
        <div className="flex justify-between items-center">
          <h1 className="sm:text-3xl text-2xl text-green-900  ">
            Create new receipt
          </h1>
          <RegularButton styles={"bg border-green-800 "}>
            <p className="text-green-900 text-xs">Add to existing receipt</p>
          </RegularButton>
        </div>

        <Formik
          initialValues={DEFAULT_INPUT_VALUES}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-10"
            >
              {(() => {
                switch (stage) {
                  case ReceiptStage.ITEMS:
                    return (
                      <div className="flex flex-col gap-8 justify-center">
                        <div className="flex flex-col gap-5">
                          <div>
                            <input
                              className="border-b-[1.5px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                              type="description"
                              placeholder="Description/Title"
                              name="description"
                              value={item.description}
                              onChange={(e) => {
                                handleItemAdd(e.target.value, "description");
                              }}
                            />
                          </div>

                          <div>
                            <input
                              className="border-b-[1.5px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                              type="price"
                              value={item.price}
                              name="price"
                              placeholder="Price"
                              onChange={(e) => {
                                handleItemAdd(e.target.value, "price");
                              }}
                            />
                          </div>
                          <p>Barcode</p>
                          <div className="flex gap-4">
                            <button className="w-1/2 bg border-green-900 border-[1.5px] flex justify-center items-center h-[60px] rounded-md">
                              <p
                                className="text-green-900 text-sm"
                                onClick={() => {
                                  setIsBarcode(false);
                                }}
                              >
                                Scan barcode
                              </p>
                            </button>
                            <button
                              className="w-1/2 bg border-green-900 border-[1.5px] flex justify-center items-center h-[60px] rounded-md"
                              onClick={() => {
                                setIsBarcode(true);
                              }}
                            >
                              <p className="text-green-900 text-sm">
                                Input a barcode
                              </p>
                            </button>
                          </div>
                          {isBarcode && (
                            <div>
                              <input
                                className="border-b-[1.5px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                                type="barcode"
                                name="barcode"
                                value={item.barcode}
                                placeholder="Barcode"
                                onChange={(e) => {
                                  handleItemAdd(e.target.value, "barcode");
                                }}
                              />
                            </div>
                          )}
                          <p>Image</p>
                          <UploadButton
                            appearance={{
                              button:
                                "ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed bg-green-900  after:bg-orange-00 w-full",
                            }}
                            endpoint="imageUploader"
                            content={{
                              allowedContent: (
                                <div className="text-[12px] mt-2"></div>
                              ),
                            }}
                            onClientUploadComplete={(res) => {
                              console.log("Files: ", res);
                              handleItemAdd(res, "photo");
                            }}
                            onUploadError={(error: Error) => {
                              alert(`ERROR! ${error.message}`);
                            }}
                          />

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
                        <div>
                          {values.items.map((item, index) => (
                            <div key={index} className="flex gap-4">
                              {item.photo && (
                                <div className="w-1/4 max-w-[300px]">
                                  <img
                                    src={item.photo[0]?.url}
                                    alt=""
                                    style={{
                                      padding: "",
                                      objectFit: "contain",

                                      borderRadius: "2px",
                                    }}
                                  />
                                </div>
                              )}

                              <div>
                                <p>{item.description}</p>
                                <p>{item.barcode}</p>
                                <p>{item.price}</p>
                                <button
                                  onClick={() => {
                                    const currentItems = values.items;
                                    currentItems.splice(index, 1);
                                    setFieldValue("items", currentItems);
                                    deletePhoto(item.photo[0].key);
                                  }}
                                >
                                  remove
                                </button>
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
                    );
                  case ReceiptStage.PREVIEW:
                    return (
                      <div className="flex flex-col gap-6">
                        {isMobile && (
                          <div className=" flex justify-between">
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
                              submit
                              styles={"bg-green-900 border-green-900 "}
                              handleClick={() => handleSubmit()}
                            >
                              <p className="text-white text-sm">Submit</p>
                            </RegularButton>
                          </div>
                        )}

                        <div className="receipts ">
                          <div className="flex flex-col gap-4 receipt-bar">
                            <h1 className="text-green-900 text-2xl ">
                              {values.store}
                            </h1>

                            <div>
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
                            </div>
                            <div>
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
                            </div>
                          </div>
                          {values.receiptImage.length > 0 && (
                            <img
                              src={values.receiptImage[0].url}
                              alt=""
                              style={{
                                padding: "",
                                objectFit: "contain",
                                width: "50%",
                                height: "50%",
                                borderRadius: "2px",
                              }}
                            />
                          )}

                          <div className="grid grid-cols-3 gap-10 receipt-grid mb-[100px]">
                            {values.items.map((item, index) => (
                              <div key={index}>
                                <ReceiptItems item={item} />
                              </div>
                            ))}
                          </div>
                        </div>
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
                      <div className="flex flex-col gap-8">
                        <h1>Receipt</h1>
                        <div className="flex flex-col gap-4">
                          <div>
                            <input
                              className="border-b-[1.5px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                              type="store"
                              placeholder="Store"
                              name="store"
                              value={values.store}
                              onChange={(e) =>
                                setFieldValue("store", e.target.value)
                              }
                            />
                          </div>

                          <div>
                            <input
                              className="border-b-[1.5px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                              placeholder="Card"
                              type="card"
                              name="card"
                              value={values.card}
                              onChange={(e) =>
                                setFieldValue("card", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <input
                              className="border-b-[1.5px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                              type="amount"
                              placeholder="Amount"
                              name="amount"
                              value={values.amount}
                              onChange={(e) =>
                                setFieldValue("amount", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <input
                              className="border-b-[1.5px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                              placeholder="Bought Date"
                              type="boughtDate"
                              name="boughtDate"
                              value={values.boughtDate}
                              onChange={(e) =>
                                setFieldValue("boughtDate", e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <input
                              className="border-b-[1.5px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                              type="finalReturnDate"
                              placeholder="Final Return Date"
                              name="finalReturnDate"
                              value={values.finalReturnDate}
                              onChange={(e) =>
                                setFieldValue("finalReturnDate", e.target.value)
                              }
                            />
                          </div>
                          <div className="w-full">
                            <UploadButton
                              appearance={{
                                button:
                                  "ut-ready:bg-[#e2f1e2] border-[1.5px] border-green-900 text-green-900 ut-uploading:cursor-not-allowed bg-green-900  after:bg-orange-00 w-full",
                              }}
                              endpoint="imageUploader"
                              content={{
                                allowedContent: (
                                  <div className="text-[12px] mt-2"></div>
                                ),
                              }}
                              onClientUploadComplete={(res) => {
                                console.log("Files: ", res);
                                setFieldValue("receiptImage", res);
                              }}
                              onUploadError={(error: Error) => {
                                alert(`ERROR! ${error.message}`);
                              }}
                            />
                          </div>
                          {values.receiptImage.length > 0 && (
                            <div className="">
                              <div className="flex-grow mb-2">
                                <Image
                                  src={values.receiptImage[0].url}
                                  alt=""
                                  width={100}
                                  height={100}
                                />
                              </div>
                              <div className="text-center">
                                {/* <p
                                  className="cursor-pointer text-slate-400"
                                  onClick={backDelete}
                                >
                                  Undo
                                </p> */}
                              </div>
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
                          <p className="text-green-900 ">Next: Receipt items</p>
                        </RegularButton>
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
