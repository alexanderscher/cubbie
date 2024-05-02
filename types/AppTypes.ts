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
  timezone: {
    value: string;
    label: string;
  };
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
  receipt: Receipt;
  readBy: ReadEntry[];
}

export interface ReadEntry {
  alertId: string;
  userId: string;
  read: boolean;
}
