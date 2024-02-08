import * as Yup from "yup";

export const RECEIPT_SCHEMA = Yup.object({
  store: Yup.string().required("Store is required"),
  amount: Yup.string().required("Amount is required"),
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
    .min(1, "At least one item is required")
    .required("At least one item is required"),
  store: Yup.string().required("Store is required"),
});
