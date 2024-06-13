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
import {
  getReceiptByIdClient,
  getReceiptsClient,
} from "@/lib/getReceiptsClient";
import {
  SearchProjectProvider,
  useSearchProjectContext,
} from "@/components/context/SearchProjectContext";

interface SearchReceiptContextType {
  receipts: ReceiptType[];
  filteredReceiptData: ReceiptType[];
  initializeReceipts: (data: ReceiptType[]) => void;
  filterReceipts: (searchTerm: string) => void;
  fetchReceipts: () => Promise<void>;
  isReceiptLoading: boolean;
  setisReceiptLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isReceiptRefresh: boolean;
  setReceiptRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  reloadReceipts: () => void;
  fetchReceiptById: () => Promise<void>;
  receipt: ReceiptType;
}

export const SearchReceiptContext = createContext<SearchReceiptContextType>(
  {} as SearchReceiptContextType
);

export const useSearchReceiptContext = () => useContext(SearchReceiptContext);

const fetchReceiptData = async () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const receipts = await getReceiptsClient(timezone);
  return receipts as ReceiptType[];
};

const fetchReceiptDataById = async (id: string) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const receipt = await getReceiptByIdClient(id, timezone);
  return receipt as ReceiptType;
};

export const SearchReceiptProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [receipts, setReceipts] = useState<ReceiptType[]>([]);
  const [filteredReceiptData, setFilteredReceiptData] = useState<ReceiptType[]>(
    []
  );
  const [isReceiptLoading, setisReceiptLoading] = useState(true);
  const [isReceiptRefresh, setReceiptRefresh] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptType>({} as ReceiptType);
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

  const fetchReceipts = useCallback(async () => {
    setisReceiptLoading(true);
    try {
      const receipts = await fetchReceiptData();
      initializeReceipts(receipts);
    } catch (error) {
      console.error("Failed to fetch receipts:", error);
    } finally {
      setisReceiptLoading(false);
    }
  }, [initializeReceipts]);

  const fetchReceiptById = useCallback(async () => {
    setisReceiptLoading(true);
    try {
      const receipt = await fetchReceiptDataById(
        pathname.split("/receipt/")[1]
      );
      setReceipt(receipt);
    } catch (error) {
      console.error("Failed to fetch receipt:", error);
    } finally {
      setisReceiptLoading(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (pathname.includes("/receipt/")) {
      fetchReceiptById();
    } else {
      fetchReceipts();
    }
  }, [fetchReceipts, fetchReceiptById, pathname]);

  const { reloadProject } = useSearchProjectContext();

  const reloadReceipts = () => {
    if (pathname === "/receipts") {
      fetchReceipts();
    } else if (pathname.startsWith("/project/")) {
      reloadProject();
    } else if (pathname.startsWith("/receipt/")) {
      fetchReceiptById();
    }
  };

  return (
    <SearchReceiptContext.Provider
      value={{
        receipts,
        filteredReceiptData,
        initializeReceipts,
        fetchReceipts,
        filterReceipts,
        isReceiptLoading,
        setisReceiptLoading,
        isReceiptRefresh,
        setReceiptRefresh,
        reloadReceipts,
        fetchReceiptById,
        receipt,
      }}
    >
      {children}
    </SearchReceiptContext.Provider>
  );
};
