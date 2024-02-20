"use client";

import styles from "@/app/receipt/receiptID.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";

import { Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY, formatDateToYYYYMMDD } from "@/utils/Date";

import { Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { ReceiptItems } from "@/app/components/receiptComponents/ReceiptItems";
import { formatCurrency } from "@/utils/formatCurrency";

const ReceiptPage = () => {
  const { id } = useParams();

  const [receipt, setReceipt] = useState({} as ReceiptType);

  useEffect(() => {
    const fetchReceipt = async () => {
      const res = await fetch(`/api/receipt/${id}`);
      const data = await res.json();
      const formattedReceipt = {
        ...data.receipt,

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

  if (!receipt.items) return <div>Loading</div>;
  return (
    <Formik
      initialValues={{
        ...receipt,
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({
        handleSubmit,
        setFieldValue,
        values,
        handleChange,
        validateForm,
      }) => (
        <div className="flex flex-col gap-8  max-w-[1060px] h-full pb-[200px]">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl text-orange-600 w-3/4">{receipt.store}</h1>
            <div className="flex gap-2">
              <RegularButton styles="bg-emerald-900">
                <Link href={`/receipt/${receipt.id}/edit`}>
                  <p className="text-white text-sm">Edit</p>
                </Link>
              </RegularButton>
              <RegularButton styles="bg-emerald-900" handleClick={handleSubmit}>
                {/* <Link href={`/receipt/${receipt.id}`}> */}
                <p className="text-white text-sm">Save</p>
                {/* </Link> */}
              </RegularButton>
            </div>
          </div>
          <div className="flex bg-white rounded-md text-sm shadow p-4">
            <div className="w-1/2 border-r-[1.5px] border-slate-300 ">
              <p className="text-slate-500 text-xs">Total amount</p>
              <p>{formatCurrency(receipt.amount)}</p>
            </div>
            <div className="w-1/2 pl-4 ">
              <p className="text-slate-500 text-xs">Quantity</p>
              <p>{receipt.items.length}</p>
            </div>
          </div>

          <div className={`${styles.receipt} h-[700px]`}>
            <div className={`${styles.receiptLeft}  flex flex-col gap-2`}>
              <div className={` rounded-md  bg-white flex flex-col gap-4 p-4`}>
                <p className="text-lg text-emerald-900">Receipt Information</p>
                {!receipt.receipt_image_url && (
                  <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                    <div className="w-full h-full flex justify-center items-start ">
                      <Image
                        src="/receipt_b.png"
                        alt=""
                        width={60}
                        height={60}
                        className="object-cover bg-white pt-4"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                  </div>
                )}

                {receipt.receipt_image_url && (
                  <div className="w-full h-[400px] overflow-hidden relative flex justify-center items-center flex-shrink-0  rounded-md">
                    <div className="w-[300px] flex justify-center">
                      <Image
                        src={receipt.receipt_image_url}
                        width={280}
                        height={280}
                        alt="Receipt Image"
                        className="object-contain rounded-md"
                        layout="intrinsic"
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 text-sm p-4">
                  <div className="w-full ">
                    <p className="text-slate-500 text-xs">Rececipt Type</p>
                    <input
                      value={values.type}
                      onChange={handleChange("type")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>
                  <div className="w-full ">
                    <p className="text-slate-500 text-xs">Purcahse Date</p>
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(values.purchase_date)}
                      onChange={handleChange("purchase_date")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>

                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Return Date</p>
                    <input
                      type="date"
                      value={formatDateToYYYYMMDD(values.return_date)}
                      onChange={handleChange("return_date")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>

                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Card Used</p>
                    <input
                      value={values.card}
                      onChange={handleChange("card")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Tracking Link</p>
                    <input
                      value={values.tracking_number}
                      onChange={handleChange("tracking_number")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:w-1/2 w-full pb-[200px]">
              <p className="text-lg text-emerald-900">Items</p>
              <div className={`${styles.boxes} `}>
                {receipt.items.length > 0 &&
                  receipt.items.map((item: any) => (
                    <ReceiptItems
                      key={item.id}
                      item={item}
                      asset_amount={receipt.asset_amount}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default ReceiptPage;
