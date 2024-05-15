export interface ReturnType {
  id: number;
  store: string;
  days: number;
  created_at: Date;
  User?: {
    connect: {
      id: string;
    };
  };
}
