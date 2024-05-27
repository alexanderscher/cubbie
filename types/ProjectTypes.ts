import { ReceiptType } from "@/types/ReceiptTypes";

export interface ProjectType {
  asset_amount: number | null;
  created_at: Date;
  id: number;
  name: string;
  projectUserArchive: ProjectUserArchiveType[];
  projectUsers: ProjectUserType[];
  receipts: ReceiptType[];
  userId: string;
  user: User;
}

export interface ProjectUserArchiveType {
  id: number;
  projectId: number;
  userId: string;
}

export interface ProjectUserType {
  projectId: number;
  user: User;
  userId: string;
}

export interface ProjectItemType {
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
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  password?: string | null;
  role: string;
  isTwoFactorEnabled: boolean;
  phone?: string | null;
  stripeCustomerId?: string | null;
  subscriptionDate?: Date | null;
  subscriptionID?: string | null;
  subscriptionType?: string | null;
  planId?: number | null; // Changed type to match Prisma's possible integer reference
}
