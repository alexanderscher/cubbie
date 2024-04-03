import * as Yup from "yup";

export const EDIT_RECEIPT_SCHEMA = Yup.object({
  store: Yup.string().required("Store is required"),
  purchase_date: Yup.date().required("Purchase date is required"),
  return_date: Yup.date().required("Return date is required"),
  tracking_number: Yup.string()
    .url("The tracking number must be a valid URL")
    .nullable()
    .notRequired(),
});

export const EDIT_ITEM_SCHEMA = Yup.object({
  description: Yup.string().required("Description is required"),
  price: Yup.string().required("Price is required"),
});
