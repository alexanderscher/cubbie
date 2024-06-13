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
import { getItemsClient } from "@/lib/getItemsClient";

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
}

export const SearchItemContext = createContext<SearchItemContextType>(
  {} as SearchItemContextType
);

const fetchItemData = async () => {
  const items = await getItemsClient();
  return items as ItemType[];
};
export const useSearchItemContext = () => useContext(SearchItemContext);

export const SearchItemProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [filteredItemData, setFilteredItemData] = useState<ItemType[]>([]);
  const [isItemLoading, setisItemLoading] = useState(true);
  const [isItemRefresh, setItemRefresh] = useState(false);

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
      }}
    >
      {children}
    </SearchItemContext.Provider>
  );
};
