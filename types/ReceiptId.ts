export interface ReceiptIDItem {
  id: number;
  description: string;
  price: number;
  created_at: Date;
  photo_key: string | null; // Allow null for photo_key
  photo_url: string | null;
  barcode: string | null;
  character: string | null;
  receipt_id: number;
  returned: boolean;
}

export interface ReciptProjectIDType {
  id: number;
  name: string;
  asset_amount: number | null;
  created_at: Date;
  userId: string;
}

export interface ReceiptIDType {
  created_at: Date;
  days_until_return: number;
  expired: boolean;
  id: number;
  items: ReceiptIDItem[];
  memo: boolean;
  project: ReciptProjectIDType;
  project_id: number;
  purchase_date: Date;
  receipt_image_key?: string | null; // Make properties optional by adding "?" after the property name
  receipt_image_url?: string | null;
  return_date: Date;
  store: string;
  tracking_number?: string | null;
  type: string;
  card?: string | null;
}
