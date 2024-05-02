import { Receipt } from "@prisma/client";

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
