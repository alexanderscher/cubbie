import * as Yup from "yup";

export const ReceiptSchema = Yup.object({
  store: Yup.string().required("Store is required"),
  amount: Yup.number()
    .required("Amount is required")
    .typeError("Amount must be a number")
    .positive("Amount must be positive"),

  boughtDate: Yup.date().required("Bought date is required"),
  daysUntilReturn: Yup.number().required("Days until return is required"),
});

export const ItemsSchema = Yup.object({
  items: Yup.array()
    .min(1, "At least one item is required")
    .required("Items are required"),
});
