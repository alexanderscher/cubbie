enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
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
  receipt_id: number;
  created_at: Date;
  returned: boolean;
  receipt: Receipt;
}

export interface ExtendedItemType extends Item {
  edit_image: string;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: UserRole;
  accounts: any;
  isTwoFactorEnabled: boolean;
  phone?: string;
  twoFactorConfirmation?: any;
  projects: DefaultProject[];
  projectOwnerships: DefaultProject[];
  alerts: Alert[];
  ProjectUser: ProjectUser[];
  AlertRead: ReadEntry[];
}

export interface ProjectUser {
  id: number;
  user_id: string;
  project_id: number;
  user: User;
  project: DefaultProject;
}
export interface Project {
  id: number;
  name: string;
  created_at: Date;
  userId: string;
  receipts: Receipt[];
  asset_amount: number;
  archive: boolean;
  projectUsers: ProjectUser[];
}
export interface LayoutProps {
  children?: React.ReactNode;
}

export interface UserForSession {
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
  user: UserForSession;
}

export interface Alert {
  id: string;
  type: string;
  receiptId: number;
  date: Date;
  projectId: number;
  receipt: DefaultReceipt;
  readBy: ReadEntry[];
}

export interface ReadEntry {
  alertId: string;
  userId: string;
  read: boolean;
}

export interface DefaultReceipt {
  id: number;
  type: string;
  store: string;
  card?: string | null;
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
  items?: Item[];
}

export interface DefaultProject {
  id: number;
  name: string;
  created_at: Date;
  userId: string;
  asset_amount: number | null;
  archive: boolean;
  projectUsers: ProjectUser[];
}
