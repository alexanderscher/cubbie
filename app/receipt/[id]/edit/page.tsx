"use client";

import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";

import { Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToYYYYMMDD } from "@/utils/Date";

import { Formik } from "formik";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { ReceiptItems } from "@/app/components/receiptComponents/ReceiptItems";
import { formatCurrency } from "@/utils/formatCurrency";
import { EDIT_RECEIPT_SCHEMA } from "@/utils/editValidation";
import CurrencyInput from "react-currency-input-field";
import Loading from "@/app/components/Loading";
import ErrorModal from "@/app/components/error/Modal";
import HeaderNav from "@/app/components/navbar/HeaderNav";

type ExtendedReceiptType = ReceiptType & {
  edit_image: string;
};

const ReceiptPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [receipt, setReceipt] = useState({} as ExtendedReceiptType);
  const [errorM, setErrorM] = useState({
    purchase_date: "",
    return_date: "",
    tracking_number: "",
    store: "",
  });

  useEffect(() => {
    const fetchReceipt = async () => {
      const res = await fetch(`/api/receipt/${id}`);
      const data = await res.json();
      const formattedReceipt = {
        ...data.receipt,
        edit_image: "",

        purchase_date: data.receipt.purchase_date
          ? data.receipt.purchase_date.split("T")[0]
          : "",
        return_date: data.receipt.return_date
          ? data.receipt.return_date.split("T")[0]
          : "",
      };
      setReceipt(formattedReceipt);
    };
    fetchReceipt();
  }, [id]);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.match("image.*")) {
        alert("Please upload an image file");

        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFieldValue("receipt_image_url", "");
          setFieldValue("edit_image", reader.result);
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
    }
  };

  if (!receipt.items) return <div className="mi">Loading</div>;
  return (
    <Formik
      initialValues={{
        ...receipt,
      }}
      onSubmit={(values) => {
        setLoading(true);

        const update = async () => {
          setLoading(true);
          const res = await fetch(`/api/receipt/${id}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
              "Content-Type": "application/json",
            },
          });

          const data = await res.json();
          if (data.error) {
            setUploadError(data.error);
            setLoading(false);
          } else {
            setUploadError("");
            setLoading(false);
            router.push(`/receipt/${id}`);
          }
        };

        update();
      }}
      validationSchema={EDIT_RECEIPT_SCHEMA}
    >
      {({
        handleSubmit,
        values,
        handleChange,
        validateForm,
        dirty,
        setFieldValue,
      }) => (
        <div className="flex flex-col gap-8  w-full h-full pb-[200px]">
          <HeaderNav receipt={receipt} />
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl text-orange-600 w-3/4">{receipt.store}</h1>
            <div className="flex gap-2">
              {dirty ? (
                <div className="flex gap-3">
                  <RegularButton
                    styles="bg  border-emerald-900"
                    href={`/receipt/${id}`}
                  >
                    <p className="text-emerald-900 text-sm">Discard</p>
                  </RegularButton>
                  <RegularButton
                    styles="bg-emerald-900  border-emerald-900"
                    handleClick={async () => {
                      const error = await validateForm();
                      if (error) {
                        setErrorM({
                          store: (error.store as string) || "",
                          purchase_date: (error.purchase_date as string) || "",
                          return_date: (error.return_date as string) || "",
                          tracking_number: error.tracking_number || "",
                        });
                      }
                      if (Object.keys(error).length === 0) {
                        handleSubmit();
                      }
                    }}
                  >
                    <p className="text-white text-sm">Save</p>
                  </RegularButton>
                </div>
              ) : (
                <RegularButton styles="bg-emerald-900" href={`/receipt/${id}`}>
                  <p className="text-white text-sm">Cancel</p>
                </RegularButton>
              )}
            </div>
          </div>
          <div className="flex bg-white rounded-lg text-sm shadow p-4">
            <div className="w-1/2 border-r-[1.5px] border-slate-300 ">
              <p className="text-slate-500 text-xs">Total amount</p>
              <p>{formatCurrency(receipt.amount)}</p>
            </div>
            <div className="w-1/2 pl-4 ">
              <p className="text-slate-500 text-xs">Quantity</p>
              <p>{receipt.items.length}</p>
            </div>
          </div>

          <div className={`${styles.receipt} `}>
            <div className={`${styles.receiptLeft}  flex flex-col gap-2 `}>
              <div className={` rounded-lg  bg-white flex flex-col gap-4 p-6`}>
                <div>
                  {" "}
                  <p className="text-xl text-emerald-900">
                    Receipt Information
                  </p>
                </div>

                {!values.receipt_image_url && !values.edit_image && (
                  <div className="w-full h-[200px] overflow-hidden  border-[1.5px] border-dashed rounded-lg bg-slate-100">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      id="edit"
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                    />
                    <div className="w-full h-full flex flex-col gap-3 justify-center items-center ">
                      <Image
                        src="/image_b.png"
                        alt=""
                        width={60}
                        height={60}
                        className="object-cover  pt-4"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                      <label
                        htmlFor="edit"
                        className=""
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        Upload an image
                      </label>
                    </div>
                  </div>
                )}
                {values.edit_image && (
                  <div className="w-full flex justify-center items-center relative group">
                    <div className="relative  w-[200px] max-h-[400px] rounded-lg overflow-hidden">
                      <Image
                        src={values.edit_image}
                        width={300}
                        height={300}
                        alt="Receipt Image"
                        className="object-contain rounded-lg w-full"
                        layout="intrinsic"
                      />
                      <div className="absolute inset-0 rounded-lg bg-slate-200 bg-opacity-0 group-hover:bg-opacity-50 flex justify-center items-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 cursor-pointer">
                        <button
                          className="absolute text-black top-0 left-0 m-2"
                          onClick={() => {
                            setFieldValue("edit_image", "");
                          }}
                        >
                          Remove
                        </button>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                          id="replace"
                          style={{
                            opacity: 0,
                            position: "absolute",
                            zIndex: -1,
                          }}
                        />
                        <label
                          htmlFor="replace"
                          className="absolute text-black top-0 right-0 m-2"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          Replace
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {values.receipt_image_url && (
                  <div className="w-full flex justify-center items-center relative group">
                    <div className="relative  w-[200px] max-h-[400px] rounded-lg overflow-hidden">
                      <Image
                        src={values.receipt_image_url}
                        width={300}
                        height={300}
                        alt="Receipt Image"
                        className="object-contain rounded-lg w-full"
                        layout="intrinsic"
                      />
                      <div className="absolute inset-0 rounded-lg bg-slate-200 bg-opacity-0 group-hover:bg-opacity-50 flex justify-center items-center transition-opacity duration-300 opacity-0 group-hover:opacity-100 cursor-pointer">
                        <button
                          className="absolute text-black top-0 left-0 m-2"
                          onClick={() => {
                            setFieldValue("receipt_image_url", "");
                          }}
                        >
                          Remove
                        </button>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                          id="replace"
                          style={{
                            opacity: 0,
                            position: "absolute",
                            zIndex: -1,
                          }}
                        />
                        <label
                          htmlFor="replace"
                          className="absolute text-black top-0 right-0 m-2"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          Replace
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 text-sm">
                  <div className="w-full ">
                    <p className="text-slate-500 text-xs">Store Name</p>
                    <input
                      value={values.store}
                      onChange={handleChange("store")}
                      className="w-full border-[1.5px] border-slate-300 rounded-lg p-2"
                    />
                    {errorM.store && (
                      <p className="text-orange-900 text-xs">{errorM.store}</p>
                    )}
                  </div>
                  <div className="w-full ">
                    <p className="text-slate-500 text-xs">Receipt Type</p>
                    <select
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      className="w-full border-[1.5px] border-slate-300 rounded-lg p-2"
                    >
                      <option value={values.type}>
                        {values.type
                          ? values.type.charAt(0).toUpperCase() +
                            values.type.slice(1)
                          : "Select type"}
                      </option>

                      {values.type !== "Store" && (
                        <option value="Store">Store</option>
                      )}
                      {values.type !== "Online" && (
                        <option value="Online">Online</option>
                      )}
                    </select>
                  </div>

                  <div className="w-full ">
                    <p className="text-slate-500 text-xs">Purcahse Date</p>
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(values.purchase_date)}
                      onChange={handleChange("purchase_date")}
                      className="w-full border-[1.5px] border-slate-300 rounded-lg p-2"
                    />
                    {errorM.purchase_date && (
                      <p className="text-orange-900 text-xs">
                        {errorM.purchase_date}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Return Date</p>
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(values.return_date)}
                      onChange={handleChange("return_date")}
                      className="w-full border-[1.5px] border-slate-300 rounded-lg p-2"
                    />
                    {errorM.return_date && (
                      <p className="text-orange-900 text-xs">
                        {errorM.return_date}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Card Used</p>
                    <input
                      value={values.card}
                      onChange={handleChange("card")}
                      className="w-full border-[1.5px] border-slate-300 rounded-lg p-2"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Asset Amount</p>
                    <CurrencyInput
                      id="asset_amount"
                      name="asset_amount"
                      className="w-full border-[1.5px] border-slate-300 rounded-lg p-2"
                      placeholder=""
                      value={values.asset_amount}
                      defaultValue={values.asset_amount || ""}
                      decimalsLimit={2}
                      onValueChange={(values) => {
                        setFieldValue("asset_amount", values);
                      }}
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Tracking Link</p>
                    <input
                      value={values.tracking_number}
                      onChange={handleChange("tracking_number")}
                      className="w-full border-[1.5px] border-slate-300 rounded-lg p-2"
                    />
                    {errorM.tracking_number && (
                      <p className="text-orange-900 text-xs">
                        {errorM.tracking_number}
                      </p>
                    )}
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
                      index={index}
                      length={receipt.items.length}
                      key={item.id}
                      item={item}
                      asset_amount={receipt.asset_amount}
                    />
                  ))}
              </div>
            </div>
          </div>
          {uploadError && (
            <ErrorModal
              errorMessage={uploadError}
              onClose={() => setUploadError("")}
            />
          )}
          {loading && <Loading loading={loading} />}
        </div>
      )}
    </Formik>
  );
};

export default ReceiptPage;
