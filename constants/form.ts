import { ReceiptInput } from "@/types/formTypes/form";

const TODAY = new Date().toISOString().split("T")[0];

export const DEFAULT_INPUT_VALUES: ReceiptInput = {
  type: "",
  store: "",
  card: "",
  amount: "",
  trackingNumber: "",
  boughtDate: TODAY,
  assetAmount: "",
  daysUntilReturn: 30,
  finalReturnDate: "",
  receiptImage: "",
  items: [],
  onlineType: "gpt",
  storeType: "gpt",
};

export enum ReceiptStoreStage {
  IN_STORE_RECEIPT = "IN_STORE_RECEIPT",
  IN_STORE_ITEMS_MANUAL = "IN_STORE_ITEMS",
  IN_STORE_GPT = "IN_STORE_GPT",
  PREVIEW = "PREVIEW",
}

export enum ReceiptOnlineStage {
  ONLINE_RECEIPT = "ONLINE_RECEIPT",
  ONLINE_ITEMS = "ONLINE_ITEMS",
  PREVIEW = "PREVIEW",
}
