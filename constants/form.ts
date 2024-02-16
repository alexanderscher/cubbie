import { ReceiptInput } from "@/types/form";

const TODAY = new Date().toISOString().split("T")[0];

export const DEFAULT_INPUT_VALUES: ReceiptInput = {
  type: "",
  store: "",
  card: "",
  amount: "",
  tracking_number: "",
  purchase_date: TODAY,
  assetAmount: "",
  days_until_return: 30,
  return_date: "",
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
