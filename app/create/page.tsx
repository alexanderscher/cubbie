"use client";
import ReceiptItems from "@/app/components/ReceiptItems";
import RegularButton from "@/app/components/buttons/RegularButton";
import Camera from "@/app/components/camera/Camera";
import { useIsMobile } from "@/utils/useIsMobile";
import { Formik } from "formik";
import React, { useState } from "react";

enum ReceiptStage {
  RECEIPT = "RECEIPT",
  ITEMS = "ITEMS",
  PREVIEW = "PREVIEW",
}

interface ItemInput {
  description: string;
  photo: string;
  price: number;
  barcode: string;
}

interface ReceiptInput {
  store: string;
  receiptNumber: string;
  card: string;
  amount: "";
  boughtDate: string;
  finalReturnDate: string;
  receiptImage: string;
  items: ItemInput[];
}

const DEFAULT_INPUT_VALUES: ReceiptInput = {
  store: "",
  receiptNumber: "",
  card: "",
  amount: "",
  boughtDate: "",
  finalReturnDate: "",
  receiptImage: "",
  items: [],
};

const Create = () => {
  const [stage, setStage] = useState<ReceiptStage>(ReceiptStage.RECEIPT);
  const isMobile = useIsMobile();
  const [isBarcode, setIsBarcode] = useState(false);

  const [item, setItem] = useState({
    description: "",
    photo: "",
    price: "",
    barcode: "",
    asset: false,
  });

  const handleItemAdd = (value: string, type: string) => {
    setItem({ ...item, [type]: value });
  };
  const addItemToFormik = (setFieldValue: any, values: ReceiptInput) => {
    const currentItems = values.items;
    setFieldValue("items", [...currentItems, item]);
    setItem({
      description: "",
      photo: "",
      price: "",
      barcode: "",
      asset: false,
    });
  };
  const handleStageClick = (stagePage: ReceiptStage) => {
    setStage(stagePage);
  };

  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState("");

  return (
    <div className="flex h-screen w-full mt-10  flex-col gaplaceholder:text-green-900">
      <div className="flex justify-between mb-10 items-center w-full">
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
            className="flex gaplaceholder:text-green-9000 flex-col gap-10"
          >
            {(() => {
              switch (stage) {
                case ReceiptStage.ITEMS:
                  return (
                    <div className="flex flex-col gap-8">
                      <h1>Receipt Items</h1>
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
                        <div className="flex gap-4">
                          <button className="w-1/2 bg border-green-900 border-[1.5px] flex justify-center items-center h-[60px] rounded-md">
                            <p className="text-green-900 text-sm">Take photo</p>
                          </button>
                          <button className="w-1/2 bg border-green-900 border-[1.5px] flex justify-center items-center h-[60px] rounded-md">
                            <p className="text-green-900 text-sm">
                              Upload an image
                            </p>
                          </button>
                        </div>

                        <RegularButton
                          submit
                          styles={"border-green-900 bg-green-900 w-full"}
                          handleClick={() =>
                            addItemToFormik(setFieldValue, values)
                          }
                        >
                          <p className="text-white text-sm">Add Item</p>
                        </RegularButton>
                      </div>
                      <div>
                        {values.items.map((item, index) => (
                          <div key={index}>
                            <p>{item.description}</p>
                            <p>{item.barcode}</p>
                            <p>{item.price}</p>
                            <button
                              onClick={() => {
                                const currentItems = values.items;
                                currentItems.splice(index, 1);
                                setFieldValue("items", currentItems);
                              }}
                            >
                              remove
                            </button>
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
                          <h1 className="text-green-900 text-2xl ">Macys</h1>
                          <div className="receipt-info">
                            <h1 className="text-slate-500">Order Number</h1>
                            <h1 className="">123123123</h1>
                          </div>

                          <div>
                            <div className="receipt-info">
                              <h1 className="text-slate-500">Store</h1>
                              <h1 className="">Macys</h1>
                            </div>
                            <div className="receipt-info">
                              <h1 className="text-slate-500">Address</h1>
                              <h1 className="">1234 12th street 90077</h1>
                            </div>
                          </div>
                          <div>
                            <div className="receipt-info">
                              <h1 className="text-slate-500">
                                Number of items
                              </h1>
                              <h1 className="">5</h1>
                            </div>
                            <div className="receipt-info">
                              <h1 className="text-slate-500">Total Amount</h1>
                              <h1 className="">$300.00</h1>
                            </div>
                          </div>
                          <div>
                            <div className="receipt-info">
                              <h1 className="text-slate-500">Date Ordered</h1>
                              <h1 className="">12/23/23</h1>
                            </div>
                            <div className="receipt-info">
                              <h1 className="text-slate-500">Return Date</h1>
                              <h1 className="">12/30/23</h1>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-10 receipt-grid mb-[100px]">
                          {values.items.map((item, index) => (
                            <div key={index}>
                              <ReceiptItems />
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
                            type="receiptNumber"
                            name="receiptNumber"
                            placeholder="Receipt Number"
                            value={values.receiptNumber}
                            onChange={(e) =>
                              setFieldValue("receiptNumber", e.target.value)
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
                        <div className="flex gap-4">
                          <div className="w-1/2 bg border-green-900 border-[1.5px] flex justify-center items-center h-[60px] rounded-md">
                            <p className="text-green-900 text-sm">
                              Upload receipt image
                            </p>
                          </div>
                          <button
                            className="w-1/2 bg border-green-900 border-[1.5px] flex justify-center items-center h-[60px] rounded-md"
                            onClick={() => setShowModal(true)}
                          >
                            <p className="text-green-900 text-sm">Take photo</p>
                          </button>
                        </div>
                      </div>
                      <Modal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                      >
                        <Camera
                          // setImage={setImage}
                          setShowModal={setShowModal}
                          setFieldValue={setFieldValue}
                          field={"receiptImage"}
                        />
                      </Modal>
                      {values.receiptImage && (
                        <img src={values.receiptImage} alt="Captured" />
                      )}

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
  );
};

export default Create;

interface Props {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
const Modal = ({ show, onClose, children }: Props) => {
  if (!show) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ background: "white", padding: 20, borderRadius: 5 }}>
        <button onClick={onClose} style={{ float: "right" }}>
          Close
        </button>
        {children}
      </div>
    </div>
  );
};
