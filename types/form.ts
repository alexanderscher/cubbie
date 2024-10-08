import { ProjectType } from "@/types/ProjectTypes";
import { Session } from "@/types/Session";

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
  receiptType: string;
  store: string;
  card?: string;
  tracking_number?: string;
  purchase_date: string;
  days_until_return: number;
  return_date: string;
  receiptImage?: string;
  items: ItemInput[];
  folder: string;
  folderName: string;
  folderUserId: string;
  pdfText: string;
  gptImage: string;
}

export interface Pages {
  projects: ProjectType[];
  session: Session;
}
