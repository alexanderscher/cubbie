import { ReceiptInput } from "@/types/formTypes/form";

const TODAY = new Date().toISOString().split("T")[0];

export const DEFAULT_INPUT_VALUES: ReceiptInput = {
  type: "",
  store: "",
  card: "",
  amount: 0,
  boughtDate: TODAY,
  daysUntilReturn: 30,
  finalReturnDate: "",
  receiptImage: [],
  items: [],
  onlineType: "gpt",
  storeType: "gpt",
};
