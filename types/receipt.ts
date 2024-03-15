export interface Project {
  id?: number;
  name: string;
  created_at: Date;
  receipts?: Receipt[] | [];
  userId: number;
}

export interface Receipt {
  id: number;
  type: string;
  store: string;
  card: string;
  tracking_number: string;
  purchase_date: Date;
  days_until_return: number;
  return_date: Date;
  receipt_image_url: string;
  receipt_image_key: string;
  items: Item[];
  project: Project;
  memo: boolean;
  created_at: Date;
  asset_amount: number;
  expired: boolean;
}

export interface Item {
  id: number;
  description: string;
  photo_url?: string;
  photo_key?: string;
  price: number;
  barcode?: string;
  character?: string;
  product_id?: string;
  receipt_id: number;
  receipt: Receipt;
  returned: boolean;
}
