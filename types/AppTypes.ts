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
  receipt: Receipt;
}

export interface ExtendedItemType extends Item {
  edit_image: string;
}

export interface Project {
  id: number;
  name: string;
  created_at: Date;
  userId: string;
  receipts: Receipt[];
}
export interface LayoutProps {
  children?: React.ReactNode;
}

export interface User {
  email: string;
  id: string;
  image: string | null;
  isOAuth: boolean;
  isTwoFactorEnabled: boolean;
  name: string;
  role: string;
}

export interface Session {
  expires: string;
  user: User;
}

export interface Alert {
  id: string;
  type: string;
  receipt_id: number;
  date: Date;
  userId: string;
  read: boolean;
}
