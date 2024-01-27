"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
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
  tag: string;
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
  address: string;
  items: ItemInput[];
}

const DEFAULT_INPUT_VALUES: ReceiptInput = {
  store: "",
  receiptNumber: "",
  card: "",
  amount: "",
  boughtDate: "",
  finalReturnDate: "",
  address: "",
  items: [],
};

const page = () => {
  const [stage, setStage] = useState<ReceiptStage>(ReceiptStage.RECEIPT);
  const [items, setItems] = useState<ItemInput[]>([
    {
      description: "",
      photo: "",
      tag: "",
      price: 0,
      barcode: "",
    },
  ]);

  const handleStageClick = (stagePage: ReceiptStage) => {
    setStage(stagePage);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: "", photo: "", tag: "", price: 0, barcode: "" },
    ]);
  };

  console.log(items);

  return (
    <div className="flex h-screen w-full mt-10  flex-col gaplaceholder:text-green-9000">
      <div className="flex justify-between mb-10 items-center">
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
          // Handle form submission
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
                      <div className="flex flex-col gap-4">
                        <div>
                          <input
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                            type="description"
                            placeholder="Description"
                            name="description"
                            onChange={(e) => {}}
                          />
                        </div>
                        <div>
                          <input
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                            type="receiptNumber"
                            name="receiptNumber"
                            placeholder="Receipt Number"
                            value={values.receiptNumber}
                            onChange={(e) =>
                              setFieldValue("receiptNumber", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <RegularButton
                          submit
                          styles={"bg-orange-400 border-green-900 w-[200px]"}
                          handleClick={() =>
                            handleStageClick(ReceiptStage.RECEIPT)
                          }
                        >
                          <p className="text-green-900 text-sm">Go back</p>
                        </RegularButton>
                        <RegularButton
                          submit
                          styles={"bg-orange-400 border-green-900 w-[200px]"}
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
                    <div>
                      <div>
                        <RegularButton
                          submit
                          styles={"bg-orange-400 border-green-900 w-full"}
                          handleClick={() => handleSubmit()}
                          type="submit"
                        >
                          <p className="text-green-900 ">Submit</p>
                        </RegularButton>
                      </div>
                    </div>
                  );

                default:
                  return (
                    <div className="flex flex-col gap-8">
                      <div className="flex flex-col gap-4">
                        <div>
                          <input
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
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
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
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
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
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
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
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
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
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
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                            type="finalReturnDate"
                            placeholder="Final Return Date"
                            name="finalReturnDate"
                            value={values.finalReturnDate}
                            onChange={(e) =>
                              setFieldValue("finalReturnDate", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <input
                            className="border-b-[2px] w-full bg  border-green-900 placeholder:text-green-900  focus:outline-none"
                            type="address"
                            placeholder="Address"
                            name="address"
                            value={values.address}
                            onChange={(e) =>
                              setFieldValue("address", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <RegularButton
                        submit
                        styles={"bg-orange-400 border-green-900 w-full"}
                        handleClick={() => handleStageClick(ReceiptStage.ITEMS)}
                      >
                        <p className="text-green-900 ">Add receipt items</p>
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

export default page;
