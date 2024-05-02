import {
  ProjectUserArchiveType,
  ProjectUserType,
  User,
} from "@/types/ProjectTypes";

export interface ReceiptType {
  created_at: Date;
  days_until_return: number;
  expired: boolean;
  id: number;
  items: ReceiptItemType[];
  memo: boolean;
  project: ReceiptProjectType;
  project_id: number;
  purchase_date: Date;
  receipt_image_key?: string | null;
  receipt_image_url?: string | null;
  return_date: Date;
  store: string;
  tracking_number?: string | null;
  type: string;
  card?: string | null;
}

export interface ReceiptItemType {
  id: number;
  description: string;
  price: number;
  created_at: Date;
  photo_key: string | null;
  photo_url: string | null;
  barcode: string | null;
  character: string | null;
  receipt_id: number;
  returned: boolean;
}

export interface ReceiptProjectType {
  id: number;
  name: string;
  asset_amount: number | null;
  created_at: Date;
  userId: string;
  projectUserArchive: ProjectUserArchiveType[];
}
