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

interface SearchAlertContextType {
  alerts: Alert[];
  filteredAlertData: Alert[]; // Stores the currently displayed list, which may be filtered
  initializeAlerts: (data: Alert[]) => void; // Initializes alerts data
  filterAlerts: (searchTerm: string) => void; // Filters alerts based on a search term
  isAlertLoading: boolean; // Indicates if the item data is currently loading
  setisAlertLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isAlertRefresh: boolean; // Optional: Tracks if the alerts data needs refreshing
  setAlertRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

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
    console.log("searchTerm", searchTerm);
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

  useEffect(() => {
    setFilteredAlertData(alerts);
  }, [pathname, alerts]);

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
      }}
    >
      {children}
    </SearchAlertContext.Provider>
  );
};
