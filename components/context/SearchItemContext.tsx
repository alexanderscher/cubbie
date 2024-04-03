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
import { Item } from "@/types/AppTypes";

interface SearchItemContextType {
  items: Item[];
  filteredItemData: Item[]; // Stores the currently displayed list, which may be filtered
  initializeItems: (data: Item[]) => void; // Initializes items data
  filterItems: (searchTerm: string) => void; // Filters items based on a search term
  isItemLoading: boolean; // Indicates if the item data is currently loading
  setisItemLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isItemRefresh: boolean; // Optional: Tracks if the items data needs refreshing
  setItemRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchItemContext = createContext<SearchItemContextType>(
  {} as SearchItemContextType
);

export const useSearchItemContext = () => useContext(SearchItemContext);

export const SearchItemProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItemData, setFilteredItemData] = useState<Item[]>([]);
  const [isItemLoading, setisItemLoading] = useState(true);
  const [isItemRefresh, setItemRefresh] = useState(false);
  const pathname = usePathname();

  const initializeItems = useCallback((data: Item[]) => {
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

  useEffect(() => {
    setFilteredItemData(items);
  }, [pathname, items]);

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
      }}
    >
      {children}
    </SearchItemContext.Provider>
  );
};
