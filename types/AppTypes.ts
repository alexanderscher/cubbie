import { Receipt } from "@prisma/client";

export interface UserAlerts {
  id: string;
  name?: string;
  email?: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: string;
  isTwoFactorEnabled: boolean;
  phone?: string;
  alertSettings: AlertSettings;
}

export interface AlertSettings {
  id: string;
  userId: string;
  notifyToday: boolean;
  notifyInOneDay: boolean;
  notifyInOneWeek: boolean;
}

export interface LayoutProps {
  children?: React.ReactNode;
}

export interface Alert {
  id: string;
  type: string;
  receiptId: number;
  date: Date;
  projectId: number;
  receipt: Receipt;
  readBy: ReadEntry[];
}

export interface ReadEntry {
  alertId: string;
  userId: string;
  read: boolean;
}
