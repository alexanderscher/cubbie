export interface Receipt {
  id: number;
  type: string;
  store: string;
  card: string;
  tracking_number: string;
  purchase_date: Date;
  days_until_return: number;
  asset_amount: number;
  return_date: Date;
  receipt_image_url: string;
  receipt_image_key: string;
  items: Item[];
  memo: boolean;
  created_at: Date;
  expired: boolean;
  project_id: number;
  project: Project;
}

export interface Item {
  id: number;
  description: string;
  photo_url: string;
  photo_key: string;
  price: number;
  barcode: string;
  character: string;
  product_id: string;
  receipt_id: number;
  created_at: Date;
  returned: boolean;
  project_id: number;
  receipt: Receipt;
}

export interface Project {
  id: number;
  name: string;
  created_at: Date;
  userId: number;
  receipts: Receipt[];
}
