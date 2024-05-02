export interface ProjectIdType {
  asset_amount: number | null;
  created_at: Date;
  id: number;
  name: string;
  projectUserArchive: ProjectUserArchive[];
  projectUsers: ProjectUser[];
  receipts: DefaultReceipt[];
  userId: string;
  user: User;
}

export interface ProjectUserArchive {
  id: number;
  projectId: number;
  userId: string;
}

export interface ProjectUser {
  projectId: number;
  user: User;
}

export interface DefaultReceipt {
  id: number;
  type: string;
  store: string;
  card?: string | null | undefined;
  tracking_number: string | null;
  purchase_date: Date;
  days_until_return: number;
  return_date: Date;
  receipt_image_url: string | null;
  receipt_image_key: string | null;
  memo: boolean;
  created_at: Date;
  expired: boolean;
  project_id: number;
  items: DefaultItem[];
}

export interface DefaultItem {
  id: number;
  description: string;
  photo_url: string | null; // Allow null for optional properties
  photo_key: string | null;
  price: number;
  barcode: string | null;
  character: string | null;
  receipt_id: number;
  created_at: Date;
  returned: boolean;
}

export interface User {
  id: string;
  name?: string | null | undefined;
  email?: string | null;
  emailVerified?: Date | null | undefined; // Adjusted to match User interface
  image?: string | null;
  password?: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  phone?: string | null;
}
