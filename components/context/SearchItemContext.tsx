"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { ItemType } from "@/types/ItemsTypes";
import { getItemsByIdClient, getItemsClient } from "@/lib/getItemsClient";
import { usePathname } from "next/navigation";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";

interface SearchItemContextType {
  items: ItemType[];
  filteredItemData: ItemType[];
  initializeItems: (data: ItemType[]) => void;
  filterItems: (searchTerm: string) => void;
  isItemLoading: boolean;
  setisItemLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isItemRefresh: boolean;
  setItemRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  fetchItems: () => void;
  fetchItemById: () => void;
  reloadItems: () => void;
  item: ItemType;
  setSelectItemTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  selectItemTrigger: boolean;
}

export const SearchItemContext = createContext<SearchItemContextType>(
  {} as SearchItemContextType
);

const fetchItemData = async () => {
  const items = await getItemsClient();
  return items as ItemType[];
};

const fetchItemByIdData = async (id: string) => {
  const item = await getItemsByIdClient(id);
  return item as ItemType;
};
export const useSearchItemContext = () => useContext(SearchItemContext);

export const SearchItemProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [items, setItems] = useState<ItemType[]>([]);
  const [filteredItemData, setFilteredItemData] = useState<ItemType[]>([]);
  const [isItemLoading, setisItemLoading] = useState(true);
  const [isItemRefresh, setItemRefresh] = useState(false);
  const [item, setItem] = useState<ItemType>({} as ItemType);
  const [selectItemTrigger, setSelectItemTrigger] = useState(false);

  const initializeItems = useCallback((data: ItemType[]) => {
    setItems(data);
    setFilteredItemData(data);
    setisItemLoading(false);
  }, []);

  const filterItems = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredItemData(items);
    } else {
      const filtered = items.filter((item) =>
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredItemData(filtered);
    }
  };

  const fetchItems = useCallback(async () => {
    setisItemLoading(true);
    try {
      const items = await fetchItemData();
      initializeItems(items);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setisItemLoading(false);
    }
  }, [initializeItems]);

  const fetchItemById = useCallback(async () => {
    setisItemLoading(true);
    try {
      const item = await fetchItemByIdData(pathname.split("/item/")[1]);
      setItem(item);
    } catch (error) {
      console.error("Failed to fetch item:", error);
    } finally {
      setisItemLoading(false);
    }
  }, [pathname]);

  const { reloadReceipts } = useSearchReceiptContext();

  const reloadItems = () => {
    if (pathname === "/items") {
      fetchItems();
    } else if (pathname.startsWith("/item/")) {
      fetchItemById();
    } else if (pathname.startsWith("/receipt/")) {
      reloadReceipts();
    }
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <SearchItemContext.Provider
      value={{
        items,
        filteredItemData,
        initializeItems,
        filterItems,
        isItemLoading,
        setisItemLoading,
        isItemRefresh,
        setItemRefresh,
        fetchItems,
        fetchItemById,
        reloadItems,
        item,
        setSelectItemTrigger,
        selectItemTrigger,
      }}
    >
      {children}
    </SearchItemContext.Provider>
  );
};
