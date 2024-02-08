export interface Photo {
  key: string;
  url: string;
}
export interface ItemInput {
  description: string;
  photo?: string;
  price: number;
  barcode?: string;
  asset: boolean;
  character?: string;
  product_id?: string;
}

export interface ReceiptInput {
  type: string;
  store: string;
  card?: string;
  amount: number;
  trackingNumber?: string;
  boughtDate: string;
  daysUntilReturn: number;
  finalReturnDate: string;
  receiptImage?: "";
  items: ItemInput[];
  onlineType: string;
  storeType: string;
}

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
