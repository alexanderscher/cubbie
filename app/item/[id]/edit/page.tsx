"use client";
import styles from "../itemID.module.css";
import { useParams, useRouter } from "next/navigation";
import { Item as ItemType } from "@/types/receipt";
import React, { ChangeEvent, useEffect, useState } from "react";
import RegularButton from "@/app/components/buttons/RegularButton";
import { formatDateToMMDDYY } from "@/utils/Date";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import Shirt from "@/app/components/placeholderImages/Shirt";
import { Formik } from "formik";
import { EDIT_ITEM_SCHEMA } from "@/utils/editValidation";
import Link from "next/link";
import CurrencyInput from "react-currency-input-field";
import ErrorModal from "@/app/components/error/Modal";
import Loading from "@/app/components/Loading";
import HeaderItemNav from "@/app/components/navbar/HeaderItemNav";

type ExtendedItemType = ItemType & {
  edit_image: string;
};

const ItemID = () => {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [item, setItem] = useState({} as ExtendedItemType);
  const [errorM, setErrorM] = useState({
    price: "",
    description: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      const res = await fetch(`/api/items/${id}`);
      const data = await res.json();
      setItem(data.item);
    };
    fetchItem();
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
          setFieldValue("photo_url", "");
          setFieldValue("edit_image", reader.result);
        }
      };
      reader.onerror = (error) => {
        console.error("Error converting file to base64:", error);
      };
    }
  };

  if (!item.receipt) return <div className="min-h-screen">Loading</div>;
  return (
    <Formik
      initialValues={{
        ...item,
      }}
      onSubmit={(values) => {
        setLoading(true);

        const update = async () => {
          setLoading(true);
          const res = await fetch(`/api/items/${id}`, {
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
            router.push(`/item/${id}`);
          }
        };

        update();
      }}
      validationSchema={EDIT_ITEM_SCHEMA}
    >
      {({
        handleSubmit,
        values,
        handleChange,
        validateForm,
        dirty,
        setFieldValue,
      }) => (
        <div className="flex flex-col gap-6  max-w-[1000px] pb-[50px]">
          <HeaderItemNav item={item} />
          <div className="flex justify-between w-full ">
            <h1 className="text-2xl text-orange-600">{item.description}</h1>
            {dirty ? (
              <div className="flex gap-3">
                <RegularButton
                  styles="bg  border-emerald-900"
                  href={`/item/${id}`}
                >
                  <p className="text-emerald-900 text-xs">Discard</p>
                </RegularButton>
                <RegularButton
                  styles="bg-emerald-900  border-emerald-900"
                  handleClick={async () => {
                    const error = await validateForm();
                    if (error) {
                      setErrorM({
                        price: error.price ? error.price : "",
                        description: error.description ? error.description : "",
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
              <RegularButton styles="bg-emerald-900" href={`/item/${id}`}>
                <p className="text-white text-xs">Cancel</p>
              </RegularButton>
            )}
          </div>

          <div className={`${styles.receipt}`}>
            <div
              className={`w-full border-[1px] border-emerald-900 rounded-lg p-6 bg-white flex flex-col gap-4`}
            >
              <p className="text-xl text-emerald-900">Item Information</p>
              {!values.photo_url && !values.edit_image && (
                <div className="w-full h-[200px] overflow-hidden  border-[1px] border-dashed rounded-lg bg-slate-100">
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

              {values.photo_url && (
                <div className="w-full flex justify-center items-center relative group">
                  <div className="relative  w-[200px] max-h-[400px] rounded-lg overflow-hidden">
                    <Image
                      src={values.photo_url}
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
                          setFieldValue("photo_url", "");
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
              <div className="w-full">
                <p className="text-slate-400 text-xs">Price</p>
                <CurrencyInput
                  id="price"
                  name="price"
                  className="w-full border-[1px] border-slate-300 rounded-lg p-2"
                  placeholder=""
                  value={values.price}
                  defaultValue={values.price || ""}
                  decimalsLimit={2}
                  onValueChange={(values) => {
                    setFieldValue("price", values);
                  }}
                />
              </div>
              <div className="w-full ">
                <p className="text-slate-400 text-xs">Barcode</p>
                <input
                  value={values.barcode}
                  onChange={handleChange("barcode")}
                  className="w-full border-[1px] border-slate-300 rounded-lg p-2"
                />
              </div>
              <div className="w-full ">
                <p className="text-slate-400 text-xs">Character</p>
                <input
                  value={values.character}
                  onChange={handleChange("character")}
                  className="w-full border-[1px] border-slate-300 rounded-lg p-2"
                />
              </div>
              <div className="w-full ">
                <p className="text-slate-400 text-xs">Product ID</p>
                <input
                  value={values.product_id}
                  onChange={handleChange("product_id")}
                  className="w-full border-[1px] border-slate-300 rounded-lg p-2"
                />
              </div>
            </div>
            <div className={`w-full`}>
              <div className={`${styles.receiptLeft}   flex flex-col gap-2`}>
                <div
                  className={` border-[1px] border-emerald-900 rounded-lg p-6 bg-white flex flex-col gap-4`}
                >
                  <p className="text-xl text-emerald-900">
                    Receipt Information
                  </p>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex flex-col gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Store</p>
                        <p>{item.receipt.store}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Created at</p>
                        <p>{formatDateToMMDDYY(item.receipt.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Receipt Type</p>
                        <p>{item.receipt.type}</p>
                      </div>

                      {item.receipt.card ? (
                        <div>
                          <p className="text-slate-400">Card used</p>
                          <p>{item.receipt.card}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-400">Card used</p>
                          <p>None</p>
                        </div>
                      )}
                      {item.receipt.tracking_number ? (
                        <div>
                          <p className="text-slate-400">Tracking Link</p>
                          <p>{item.receipt.tracking_number}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-400">Tracking Link</p>
                          <p>None</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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

export default ItemID;
