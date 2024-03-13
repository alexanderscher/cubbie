import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";

interface SessionContextType {
  userId: number | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType>({
  userId: null,
  isLoading: true,
});

export const useSessionContext = () => useContext(SessionContext);

interface SessionProviderProps {
  children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      setUserId(parseInt(session.user.id));
    } else {
      setUserId(null);
    }
  }, [session]);

  const isLoading = status === "loading";

  return (
    <SessionContext.Provider value={{ userId, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};
