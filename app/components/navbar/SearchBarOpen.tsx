import { useSearchBarContext } from "@/app/components/context/SearchBarContext";
import SearchAllItems from "@/app/components/search/AlItems";
import React from "react";

const SearchBarOpen = () => {
  const { searchBarOpen, setSearchBarOpen } = useSearchBarContext();

  return (
    <>
      {searchBarOpen && (
        <div
          className={`fixed top-0 w-[400px] left-[100px] h-screen bg-emerald-900 p-4 border-l-[1px] border-white overflow-y-scroll`}
        >
          <SearchAllItems />
        </div>
      )}
    </>
  );
};

export default SearchBarOpen;
