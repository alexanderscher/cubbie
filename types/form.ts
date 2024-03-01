export interface Photo {
  key: string;
  url: string;
}
export interface ItemInput {
  [key: string]: any;
  description: string;
  photo?: string;
  price: string;
  barcode?: string;
  asset: boolean;
  character?: string;
  product_id?: string;
}

export interface ReceiptInput {
  type: string;
  store: string;
  card?: string;
  assetAmount: string;
  tracking_number?: string;
  purchase_date: string;
  days_until_return: number;
  return_date: string;
  receiptImage?: string;
  items: ItemInput[];
  onlineType: string;
  storeType: string;
  memo?: boolean;
  folder?: number;
}
