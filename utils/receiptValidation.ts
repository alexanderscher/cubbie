import * as Yup from "yup";

export const RECEIPT_SCHEMA = Yup.object({
  store: Yup.string().required("Store is required"),
  amount: Yup.number()
    .required("Amount is required")
    .typeError("Amount must be a number")
    .positive("Amount must be positive"),

  boughtDate: Yup.date().required("Bought date is required"),
  daysUntilReturn: Yup.number().required("Days until return is required"),
  trackingNumber: Yup.string()
    .url("The tracking number must be a valid URL")
    .nullable()
    .notRequired(),
});

export const ITEMS_SCHEMA = Yup.object({
  items: Yup.array()
    .min(1, "At least one item is required")
    .required("Items are required"),
});

export const GPT_IMAGE_SCHEMA = Yup.object().shape({
  items: Yup.array()
    .min(1, "Please upload a valid receipt image or enter the items manually.")
    .required(
      "Please upload a valid receipt image or enter the items manually."
    ),
  store: Yup.string().required(
    "Please upload a valid receipt image or enter the items manually."
  ),
});
