"use client";
import styles from "../receiptID.module.css";
import RegularButton from "@/app/components/buttons/RegularButton";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { TruncateText } from "@/app/components/text/Truncate";
import { Item, Receipt as ReceiptType } from "@/types/receipt";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import { Formik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const DEFAULT_INPUT_VALUES = {
  store: "",
  amount: "",
  purchase_date: "",
  return_date: "",
  type: "",
  card: "",
  tracking_number: "",
  receipt_image_url: "",
};

const ReceiptPage = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState({} as ReceiptType);

  useEffect(() => {
    const fetchReceipt = async () => {
      const res = await fetch(`/api/receipt/${id}`);
      const data = await res.json();
      setReceipt(data.receipt);
    };
    fetchReceipt();
  }, [id]);

  if (!receipt.items) return <div>Loading</div>;
  return (
    <Formik
      initialValues={{
        ...DEFAULT_INPUT_VALUES,
        type: "Online",
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
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl text-orange-600 w-3/4">{receipt.store}</h1>
            <div>
              {" "}
              <RegularButton styles="bg-emerald-900">
                <Link href={`/receipt/${receipt.id}/edit`}>
                  <p className="text-white text-sm">Edit</p>
                </Link>
              </RegularButton>
              <RegularButton styles="bg-emerald-900">
                <Link href={`/receipt/${receipt.id}`}>
                  <p className="text-white text-sm">Save</p>
                </Link>
              </RegularButton>
            </div>
          </div>

          <div className={`${styles.receipt} h-[700px]`}>
            <div className={`${styles.receiptLeft}  flex flex-col gap-2`}>
              <p className="text-lg text-emerald-900">Receipt Info</p>
              <div
                className={` border-emerald-900 border-[1.5px] rounded-md  bg-white flex flex-col gap-4 pb-10`}
              >
                {!receipt.receipt_image_url && (
                  <div className="w-full  overflow-hidden relative flex justify-center items-center ">
                    <div className="w-full h-full flex justify-center items-start ">
                      <Image
                        src="/receipt_b.png"
                        alt=""
                        width={60}
                        height={60}
                        className="object-cover bg-white pt-4"
                        style={{ objectFit: "cover", objectPosition: "center" }}
                      />
                    </div>
                  </div>
                )}

                {receipt.receipt_image_url && (
                  <div className="w-full h-[300px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col ">
                    <Image
                      src={receipt.receipt_image_url}
                      alt=""
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-t-sm"
                      style={{ objectPosition: "top" }}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-3 text-sm p-4">
                  <div className="w-full ">
                    <p className="text-slate-500 text-xs">Total amount</p>
                    <input
                      value={values.amount}
                      onChange={handleChange("amount")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>
                  <div className="w-full ">
                    <p className="text-slate-500 text-xs">Purcahse Date</p>
                    <input
                      value={values.purchase_date}
                      onChange={handleChange("purchase_date")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>

                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Return Date</p>
                    <input
                      value={values.return_date}
                      onChange={handleChange("return_date")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>

                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Card Used</p>
                    <input
                      value={values.return_date}
                      onChange={handleChange("card")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>
                  <div className="w-full">
                    <p className="text-slate-500 text-xs">Tracking Link</p>
                    <input
                      value={values.return_date}
                      onChange={handleChange("tracking_number")}
                      className="w-full border-[1.5px] border-slate-300 rounded-md p-2"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p className="text-lg text-emerald-900">Items</p>
              <div className={`${styles.boxes}`}>
                {receipt.items.length > 0 &&
                  receipt.items.map((item: any) => (
                    <ReceiptItems key={item.id} item={item} />
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

interface ReceiptItemsProps {
  item: Item;
}

const ReceiptItems = ({ item }: ReceiptItemsProps) => {
  return (
    <div className={`${styles.box}`}>
      {item.photo_url && (
        <div className="w-full h-[110px] overflow-hidden relative flex justify-center flex-shrink-0 flex-col ">
          <Image
            src={item.photo_url}
            alt=""
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-t-md"
            style={{ objectPosition: "top" }}
          />
        </div>
      )}
      <div className="p-4 flex flex-col gap-2 justify-between">
        <div>
          {!item.photo_url && <Shirt />}
          <Link href={`/item/${item.id}`}>
            <TruncateText
              text={item.description}
              maxLength={30}
              styles={"text-orange-600"}
            />
          </Link>

          <div className="text-sm">
            <p className="">{formatCurrency(item.price)}</p>
            {item.barcode && <p className="">{item.barcode}</p>}
            {item.product_id && <p className="">{item.product_id}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
