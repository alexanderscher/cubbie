import { Project } from "@/types/AppTypes";

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
}

export interface ReceiptInput {
  type: string;
  store: string;
  card?: string;
  tracking_number?: string;
  purchase_date: string;
  days_until_return: number;
  return_date: string;
  receiptImage?: string;
  items: ItemInput[];
  memo?: boolean;
  folder?: number;
  folderName?: string;
}

export interface Pages {
  projects: Project[];
}
