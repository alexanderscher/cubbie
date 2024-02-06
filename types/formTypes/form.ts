export interface Photo {
  key: string;
  url: string;
}

export interface ItemInput {
  description: string;
  photo?: Photo[];
  price: number | null;
  barcode?: string;
  asset: boolean;
  character?: string;
}

export interface ReceiptInput {
  type: string;
  store: string;
  card?: string;
  amount: number | null;
  boughtDate: string;
  daysUntilReturn: number;
  finalReturnDate: string;
  receiptImage?: Photo[];
  items: ItemInput[];
  onlineType: string;
  storeType: string;
}

export enum ReceiptStoreStage {
  IN_STORE_RECEIPT = "IN_STORE_RECEIPT",
  IN_STORE_ITEMS_MANUAL = "IN_STORE_ITEMS",
  PREVIEW = "PREVIEW",
}

export enum ReceiptOnlineStage {
  ONLINE_RECEIPT = "ONLINE_RECEIPT",
  ONLINE_ITEMS = "ONLINE_ITEMS",
  PREVIEW = "PREVIEW",
}
