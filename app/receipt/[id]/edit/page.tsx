"use client";

import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";

import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToYYYYMMDD } from "@/utils/Date";

import { Formik } from "formik";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { EDIT_RECEIPT_SCHEMA } from "@/utils/editValidation";
import CurrencyInput from "react-currency-input-field";
import Loading from "@/app/components/Loading";
import ErrorModal from "@/app/components/error/Modal";
import HeaderNav from "@/app/components/navbar/HeaderNav";
import ImageModal from "@/app/components/images/ImageModal";
import { ReceiptItems } from "@/app/components/ReceiptItems";

type ExtendedReceiptType = ReceiptType & {
  edit_image: string;
};

const ReceiptPage = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
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

  const deleteReceipt = async () => {
    setLoading(true);
    const res = await fetch(`/api/receipt/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.error) {
      setUploadError(data.error);
      setLoading(false);
    } else {
      setUploadError("");
      setLoading(false);
      router.push("/");
    }
  };

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
            <RegularButton
              styles="bg border-orange-600"
              handleClick={deleteReceipt}
            >
              <p className="text-orange-600 text-xs ">Delete Receipt</p>
            </RegularButton>
            <div className="flex gap-2">
              {dirty ? (
                <div className="flex gap-2">
                  <RegularButton
                    styles="bg  border-emerald-900"
                    href={`/receipt/${id}`}
                  >
                    <p className="text-emerald-900 text-xs">Discard</p>
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
                    <p className="text-white text-xs">Save</p>
                  </RegularButton>
                </div>
              ) : (
                <RegularButton styles="bg-emerald-900" href={`/receipt/${id}`}>
                  <p className="text-white text-xs">Cancel</p>
                </RegularButton>
              )}
            </div>
          </div>
          <div className="flex bg-white rounded-lg text-sm shadow p-4">
            <div className="w-1/2 border-r-[1px] border-slate-300 ">
              <p className="text-slate-400 text-xs">Total amount</p>
              <p>
                {formatCurrency(
                  receipt.items.reduce((acc: number, curr: Item) => {
                    return acc + curr.price;
                  }, 0)
                )}
              </p>
            </div>
            <div className="w-1/2 pl-4 ">
              <p className="text-slate-400 text-xs">Quantity</p>
              <p>{receipt.items.length}</p>
            </div>
          </div>

          <div className={`${styles.receipt} `}>
            <div className={`${styles.receiptLeft}  flex flex-col gap-2 `}>
              <div className={` rounded-lg  bg-white flex flex-col gap-4 p-6`}>
                {!values.receipt_image_url && !values.edit_image && (
                  <div className="w-full h-[200px] overflow-hidden  border-[1px] border-dashed rounded-lg bg-slate-100">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      id="edit"
                      style={{ opacity: 0, position: "absolute", zIndex: -1 }}
                    />
                    <div className="w-full h-full flex flex-col gap-4 justify-center items-center ">
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
                        className="object-contain rounded-sm w-full cursor-pointer"
                        layout="intrinsic"
                        onClick={() => setIsOpen(true)}
                      />
                      <ImageModal
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        imageUrl={values.edit_image}
                        altText="Your Image Description"
                        setFieldValue={setFieldValue}
                        handleFileChange={handleFileChange}
                        changeField="edit_image"
                      />
                    </div>
                  </div>
                )}

                {values.receipt_image_url && (
                  <div className="w-full flex justify-center items-center relative">
                    <div className="relative  w-[200px] max-h-[400px] rounded-lg overflow-hidden">
                      <Image
                        src={values.receipt_image_url}
                        width={300}
                        height={300}
                        alt="Receipt Image"
                        className="object-contain rounded-sm w-full cursor-pointer"
                        layout="intrinsic"
                        onClick={() => setIsOpen(true)}
                      />
                    </div>
                    <ImageModal
                      isOpen={isOpen}
                      setIsOpen={setIsOpen}
                      imageUrl={values.receipt_image_url}
                      altText="Your Image Description"
                      setFieldValue={setFieldValue}
                      handleFileChange={handleFileChange}
                      changeField="receipt_image_url"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-4 text-sm">
                  <div className="w-full ">
                    <p className="text-slate-400 text-xs">Store Name</p>
                    <input
                      value={values.store}
                      onChange={handleChange("store")}
                      className="w-full border-[1px] border-slate-300 focus:border-emerald-900 focus:outline-none rounded p-2"
                    />
                    {errorM.store && (
                      <p className="text-orange-900 text-xs">{errorM.store}</p>
                    )}
                  </div>
                  <div className="w-full ">
                    <p className="text-slate-400 text-xs">Purchase Type</p>
                    <select
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      className="w-full border-[1px] border-slate-300 focus:border-emerald-900 focus:outline-none rounded p-[10px]"
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
                    <p className="text-slate-400 text-xs">Purcahse Date</p>
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(values.purchase_date)}
                      onChange={handleChange("purchase_date")}
                      className="w-full border-[1px] border-slate-300 focus:border-emerald-900 focus:outline-none rounded p-2"
                    />
                    {errorM.purchase_date && (
                      <p className="text-orange-900 text-xs">
                        {errorM.purchase_date}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <p className="text-slate-400 text-xs">Return Date</p>
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(values.return_date)}
                      onChange={handleChange("return_date")}
                      className="w-full border-[1px] border-slate-300 focus:border-emerald-900 focus:outline-none rounded p-2"
                    />
                    {errorM.return_date && (
                      <p className="text-orange-900 text-xs">
                        {errorM.return_date}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <p className="text-slate-400 text-xs">Card Used</p>
                    <input
                      value={values.card}
                      onChange={handleChange("card")}
                      className="w-full border-[1px] border-slate-300 focus:border-emerald-900 focus:outline-none rounded p-2"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-slate-400 text-xs">Asset Amount</p>
                    <CurrencyInput
                      id="asset_amount"
                      name="asset_amount"
                      className="w-full border-[1px] border-slate-300 focus:border-emerald-900 focus:outline-none rounded p-2"
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
                    <p className="text-slate-400 text-xs">Tracking Link</p>
                    <input
                      value={values.tracking_number}
                      onChange={handleChange("tracking_number")}
                      className="w-full border-[1px] border-slate-300 focus:border-emerald-900 focus:outline-none rounded p-2"
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
