export interface UserForSession {
  email: string;
  id: string;
  image: string | null;
  isOAuth: boolean;
  isTwoFactorEnabled: boolean;
  name: string;
  role: string;
  timezone: string;
}

export interface Session {
  expires: string;
  user: UserForSession;
}
