"use client";
import styles from "../itemID.module.css";
import { useParams, useRouter } from "next/navigation";
import { Item as ItemType } from "@/types/receipt";
import React, { ChangeEvent, useEffect, useState } from "react";
import RegularButton from "@/app/components/buttons/RegularButton";
import { formatDateToMMDDYY } from "@/utils/Date";
import Image from "next/image";
import { Formik } from "formik";
import { EDIT_ITEM_SCHEMA } from "@/utils/editValidation";
import CurrencyInput from "react-currency-input-field";
import ErrorModal from "@/app/components/error/Modal";
import Loading from "@/app/components/Loading";
import HeaderItemNav from "@/app/components/navbar/HeaderItemNav";
import { BarcodeScanner } from "@/app/components/createForm/barcode/BarcodeScanner";
import ImageModal from "@/app/components/images/ImageModal";

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
  const [isOpen, setIsOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const deleteItem = async () => {
    setLoading(true);
    const res = await fetch(`/api/items/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.error) {
      setUploadError(data.error);
      setLoading(false);
    } else {
      setUploadError("");
      setLoading(false);
      router.push(`/receipt/${item.receipt.id}`);
    }
  };

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
        <div className="flex flex-col gap-6  max-w-[600px] ">
          <HeaderItemNav item={item} />
          <div className="flex justify-between items-center">
            <div className="flex justify-between w-1/2">
              {dirty ? (
                <div className="flex gap-2">
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
                          description: error.description
                            ? error.description
                            : "",
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
            <RegularButton
              styles="bg-orange-600 border-orange-600"
              handleClick={deleteItem}
            >
              <p className="text-white text-xs ">Delete Receipt</p>
            </RegularButton>
          </div>

          <div>
            <div className="flex flex-col gap-4">
              {!values.photo_url && !values.edit_image && (
                <div className="w-full h-[200px] overflow-hidden  border-[1px] border-dashed border-emerald-900 rounded-md bg relative">
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
                  <div className="relative  w-[200px] max-h-[400px] rounded-md overflow-hidden">
                    <Image
                      src={values.edit_image}
                      width={300}
                      height={300}
                      alt="Receipt Image"
                      className="object-contain rounded-md w-full"
                      layout="intrinsic"
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

              {values.photo_url && (
                <div className="w-full flex justify-center items-center relative ">
                  <div className="relative  w-full max-h-[300px] rounded-sm overflow-hidden">
                    <Image
                      src={values.photo_url}
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
                      imageUrl={values.photo_url}
                      altText="Your Image Description"
                      setFieldValue={setFieldValue}
                      handleFileChange={handleFileChange}
                      changeField="photo_url"
                    />
                  </div>
                </div>
              )}
              <div className="w-full ">
                <p className="text-slate-400 text-xs">Description</p>
                <input
                  value={values.description}
                  onChange={handleChange("description")}
                  className="w-full border-[1px] border-emerald-900 bg rounded-md p-2"
                />
              </div>
              <div className="w-full">
                <p className="text-slate-400 text-xs">Price</p>
                <CurrencyInput
                  id="price"
                  name="price"
                  className="w-full border-[1px] border-emerald-900 bg rounded-md p-2"
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
                <div className="flex gap-2">
                  <input
                    value={values.barcode}
                    onChange={handleChange("barcode")}
                    className="w-full border-[1px] border-emerald-900 bg rounded-md p-2"
                  />
                  <button
                    type="button"
                    className="w-[40px] h-[40px] border-[1px] border-emerald-900 p-1 rounded-md flex justify-center items-center "
                    onClick={() => {
                      setShowScanner(true);
                    }}
                    disabled={showScanner}
                  >
                    <Image
                      src="/barcode_b.png"
                      alt="barcode"
                      width={100}
                      height={100}
                      className=""
                    ></Image>
                  </button>
                  {showScanner && (
                    <div className="w-full">
                      <h1>Scan a Barcode</h1>
                      <BarcodeScanner
                        setShowScanner={setShowScanner}
                        onResult={(result) => {
                          setFieldValue("barcode", result.text);
                          setShowScanner(false);
                        }}
                        onError={(error) => {}}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setShowScanner(false);
                        }}
                      >
                        Close Scanner
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full ">
                <p className="text-slate-400 text-xs">Character</p>
                <input
                  value={values.character}
                  onChange={handleChange("character")}
                  className="w-full border-[1px] border-emerald-900 bg rounded-md p-2"
                />
              </div>
              <div className="w-full ">
                <p className="text-slate-400 text-xs">Product ID</p>
                <input
                  value={values.product_id}
                  onChange={handleChange("product_id")}
                  className="w-full border-[1px] border-emerald-900 bg rounded-md p-2"
                />
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
