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
import { ReceiptType } from "@/types/ReceiptTypes";

interface SearchReceiptContextType {
  receipts: ReceiptType[];
  filteredReceiptData: ReceiptType[];
  initializeReceipts: (data: ReceiptType[]) => void;
  filterReceipts: (searchTerm: string) => void;
  isReceiptLoading: boolean;
  setisReceiptLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isReceiptRefresh: boolean;
  setReceiptRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchReceiptContext = createContext<SearchReceiptContextType>(
  {} as SearchReceiptContextType
);

export const useSearchReceiptContext = () => useContext(SearchReceiptContext);

export const SearchReceiptProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [filteredReceiptData, setFilteredReceiptData] = useState<ReceiptType[]>(
    []
  );
  const [isReceiptLoading, setisReceiptLoading] = useState(true);
  const [isReceiptRefresh, setReceiptRefresh] = useState(false);
  const pathname = usePathname();

  const initializeReceipts = useCallback((data: ReceiptType[]) => {
    setReceipts(data);
    setFilteredReceiptData(data);
    setisReceiptLoading(false);
  }, []);

  const filterReceipts = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredReceiptData(receipts);
    } else {
      const filtered = receipts.filter((receipt) =>
        receipt.store.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredReceiptData(filtered);
    }
  };

  useEffect(() => {
    setFilteredReceiptData(receipts);
  }, [pathname, receipts]);

  return (
    <SearchReceiptContext.Provider
      value={{
        receipts,
        filteredReceiptData,
        initializeReceipts,
        filterReceipts,
        isReceiptLoading,
        setisReceiptLoading,
        isReceiptRefresh,
        setReceiptRefresh,
      }}
    >
      {children}
    </SearchReceiptContext.Provider>
  );
};
