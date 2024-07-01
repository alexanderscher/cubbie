import { ProjectType, ProjectUserArchiveType } from "@/types/ProjectTypes";
import { Plan, Project, Subscription } from "@prisma/client";

interface Item {
  barcode: string | null;
  character: string | null;
  created_at: Date;
  description: string;
  id: number;
  photo_key: string | null;
  photo_url: string | null;
  price: number;
  receipt_id: number;
  returned: boolean;
}

interface ItemUserType {
  items: Item[];
}

export interface ProjectUserType {
  asset_amount: number | null;
  created_at: Date;
  id: number;
  name: string;
  receipts: ItemUserType[];
  userId: string;
}

export interface UserType {
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
  planId?: number | null;
  projects: ProjectUserType[];
  plan: Plan;
  subscription: Subscription;
}

export interface SubscriptionProjectType {
  id: number;
  name: string;
  asset_amount: number | null;
  created_at: Date;
  userId: string;
  projectUserArchive: ProjectUserArchiveType[];
}
