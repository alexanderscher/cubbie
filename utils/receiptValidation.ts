import { memo } from "react";
import * as Yup from "yup";

export const RECEIPT_SCHEMA = Yup.object({
  store: Yup.string().required("Store is required"),
  purchase_date: Yup.date().required("Purchase date is required"),
  days_until_return: Yup.string().required("Days until return is required"),
  folderName: Yup.string().required("Project folder is required"),
  tracking_number: Yup.string()
    .url("The tracking number must be a valid URL")
    .nullable()
    .notRequired(),
});

export const ITEMS_SCHEMA = Yup.object({
  items: Yup.array().min(1, "At least one item is required"),
});

export const ITEMS_CONTENT_SCHEMA = Yup.object({
  description: Yup.string().required("Description is required"),
  price: Yup.string().required("Price is required"),
});

export const GPT_IMAGE_SCHEMA = Yup.object().shape({
  folderName: Yup.string().required("Folder is required"),
});
