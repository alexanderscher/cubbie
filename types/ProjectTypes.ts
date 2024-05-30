import { ReceiptItemType, ReceiptProjectType } from "@/types/ReceiptTypes";
import { Project } from "@prisma/client";
import { User } from "next-auth";

export interface ProjectType {
  asset_amount: number | null;
  created_at: Date;
  id: number;
  name: string;
  projectUserArchive: ProjectUserArchiveType[];
  projectUsers: ProjectUserType[];
  receipts: ProjectReceiptType[];
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

export interface ProjectReceiptType {
  created_at: Date;
  days_until_return: number;
  expired: boolean;
  id: number;
  items: ReceiptItemType[];
  memo: boolean;
  project: Project;
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
// export interface User {
//   id: string;
//   name?: string | null;
//   email?: string | null;
//   emailVerified?: Date | null;
//   image?: string | null;
//   password?: string | null;
//   role: string;
//   isTwoFactorEnabled: boolean;
//   phone?: string | null;
//   stripeCustomerId?: string | null;
//   subscriptionDate?: Date | null;
//   subscriptionID?: string | null;
//   subscriptionType?: string | null;
//   planId?: number | null; // Changed type to match Prisma's possible integer reference

// }
