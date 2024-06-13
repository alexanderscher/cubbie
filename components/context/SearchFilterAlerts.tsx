"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { Alert } from "@/types/AppTypes";
import { getAlerts } from "@/lib/alerts";

interface SearchAlertContextType {
  alerts: Alert[];
  filteredAlertData: Alert[];
  initializeAlerts: (data: Alert[]) => void;
  filterAlerts: (searchTerm: string) => void;
  isAlertLoading: boolean;
  setisAlertLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAlertRefresh: boolean;
  setAlertRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  fetchAlerts: () => void;
}

const getAlertData = async () => {
  const alerts = await getAlerts();
  return alerts as Alert[];
};

export const SearchAlertContext = createContext<SearchAlertContextType>(
  {} as SearchAlertContextType
);

export const useSearchAlertContext = () => useContext(SearchAlertContext);

export const SearchAlertProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlertData, setFilteredAlertData] = useState<Alert[]>([]);
  const [isAlertLoading, setisAlertLoading] = useState(true);
  const [isAlertRefresh, setAlertRefresh] = useState(false);
  const pathname = usePathname();

  const initializeAlerts = useCallback((data: Alert[]) => {
    setAlerts(data);
    setFilteredAlertData(data);
    setisAlertLoading(false);
  }, []);

  const filterAlerts = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredAlertData(alerts);
    } else {
      const filtered = alerts.filter((alert) =>
        alert.receipt.store.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log("filtered", filtered);

      setFilteredAlertData(filtered);
    }
  };

  const fetchAlerts = useCallback(async () => {
    setisAlertLoading(true);
    try {
      const alerts = await getAlertData();
      initializeAlerts(alerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setisAlertLoading(false);
    }
  }, [initializeAlerts]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  return (
    <SearchAlertContext.Provider
      value={{
        alerts,
        filteredAlertData,
        initializeAlerts,
        filterAlerts,
        isAlertLoading,
        setisAlertLoading,
        isAlertRefresh,
        setAlertRefresh,
        fetchAlerts,
      }}
    >
      {children}
    </SearchAlertContext.Provider>
  );
};
