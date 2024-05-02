export interface ItemType {
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
  receipt: ItemReceiptType;
}

export interface ItemReceiptType {
  card?: string | null;
  created_at: Date;
  days_until_return: number;
  expired: boolean;
  id: number;
  memo: boolean;
  project: ProjectItemId;
  project_id: number;
  purchase_date: Date;
  receipt_image_key?: string | null;
  receipt_image_url?: string | null;
  return_date: Date;
  store: string;
  tracking_number?: string | null;
  type: string;
}

export interface ProjectItemId {
  id: number;
  name: string;
  asset_amount: number | null;
  created_at: Date;
  userId: string;
}

export interface ExtendedItemType extends ItemType {
  edit_image: string;
}
