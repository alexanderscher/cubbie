"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { useSearchContext } from "@/app/components/context/SearchContext";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import SearchBar from "@/app/components/search/SearchBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./header.module.css";
import React, { useCallback, useEffect } from "react";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const [data, setData] = React.useState([]);
  const { setFilteredData, setIsLoading } = useSearchContext();
  const { setFilteredItemData, refreshData, setRefreshData } =
    useSearchItemContext();
  const [openModal, setOpenModal] = React.useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (pathname === "/items") {
      console.log("fetching items");
      const fetchItems = async () => {
        const res = await fetch("/api/items");
        const data = await res.json();
        setData(data.items);
        setFilteredItemData(data.items);
        setRefreshData(false);
      };
      fetchItems();
    }
  }, [
    pathname,
    setFilteredItemData,
    setIsLoading,
    refreshData,
    setRefreshData,
  ]);

  useEffect(() => {
    if (pathname !== "/items") {
      const fetchReceipts = async () => {
        setIsLoading(true);
        const res = await fetch("/api/receipt");
        const data = await res.json();
        setData(data.receipts);
        setFilteredData(data.receipts);
        setIsLoading(false);
      };
      fetchReceipts();
    }
  }, [pathname, setFilteredData, setIsLoading]);

  const receiptColor =
    pathname === "/"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";

  const itemColor =
    pathname === "/items"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";

  return (
    <div className="flex flex-col gap-6 pb-4 ">
      <div className="flex justify-between pb-2">
        <h1 className="text-3xl text-emerald-900  ">{type}</h1>
        <RegularButton
          href="/receipt-type"
          styles="bg-emerald-900 border-emerald-900 text-white"
        >
          <p className="text-xs">Create new</p>
        </RegularButton>
      </div>
      <div className="flex gap-2 ">
        <RegularButton href="/" styles={receiptColor}>
          <p className="text-xs">Receipts</p>
        </RegularButton>

        <RegularButton styles={itemColor} href="/items">
          <p className="text-xs">Items</p>
        </RegularButton>
      </div>
      <div className="pb-4 flex justify-between items-center relative flex-wrap gap-4 ">
        <SearchBar
          data={data}
          searchType={type}
          type={pathname === "/items" ? "item" : "receipt"}
        />
        <div className="fixed z-10 bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            className="px-[60px] py-[8px] border-[1px] border-emerald-900 bg-emerald-900 text-white rounded-3xl"
            onClick={() => {
              setOpenModal(!openModal);
            }}
          >
            <p className="text-sm">Filter</p>
          </button>
        </div>

        <div className="flex gap-2 ">
          <div className="">
            {openModal && pathname === "/" && (
              <FilterOptions
                pathname={pathname}
                onClose={() => setOpenModal(false)}
                createQueryString={createQueryString}
                searchParams={searchParams}
              />
            )}

            {openModal && pathname === "/items" && (
              <FilterItemsOptions
                pathname={pathname}
                onClose={() => setOpenModal(false)}
                createQueryString={createQueryString}
                searchParams={searchParams}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

interface FilterOptionsProps {
  onClose: () => void;
  createQueryString: (name: string, value: string) => string;
  pathname: string;
  searchParams: URLSearchParams;
}

const FilterOptions = ({
  createQueryString,
  pathname,
  searchParams,
  onClose,
}: FilterOptionsProps) => {
  const handleTypeClick = (name: string) => {
    router.push(pathname + "?" + createQueryString("receiptType", name));
  };

  const handleSortClick = (name: string) => {
    const queryParams = new URLSearchParams(window.location.search);

    const currentSort = queryParams.get("sort");
    const currentDirection = currentSort?.includes("-") ? "desc" : "asc";

    let newDirection;
    if (currentSort === name && currentDirection === "asc") {
      newDirection = "desc";
    } else {
      newDirection = "asc";
    }

    const newSortValue = newDirection === "asc" ? name : `-${name}`;

    queryParams.set("sort", newSortValue);

    router.push(`${pathname}?${queryParams.toString()}`);
  };

  const handleStoreClick = (name: string) => {
    router.push(pathname + "?" + createQueryString("storeType", name));
  };

  const router = useRouter();

  return (
    <div className={`overlay`}>
      <div className={`flex flex-col modal`}>
        <div className="border-b-[1px] border-emerald-900 flex ">
          <div className="p-4 flex w-full">
            <p className="text-center w-full text-orange-600 text-lg">Filter</p>
            <button onClick={onClose}>&times;</button>
          </div>
        </div>
        <div className="border-b-[1px] border-emerald-900 flex flex-col">
          <div className="p-4 ">
            <p className="text-sm w-full text-center text-emerald-900">
              Receipt Type
            </p>
          </div>
          <div className="flex w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("receiptType") === "all" ||
                !searchParams.get("receiptType")
                  ? "w-1/2 border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-1/2 border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleTypeClick("all");
              }}
            >
              <p className="text-xs">Receipts & Memos</p>
            </button>
            <button
              className={`${
                searchParams.get("receiptType") === "receipt"
                  ? "w-1/2 border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-1/2 border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleTypeClick("receipt");
              }}
            >
              <p className="text-xs">Receipts</p>
            </button>
            <button
              className={`${
                searchParams.get("receiptType") === "memo"
                  ? "w-1/2 border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-1/2 border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleTypeClick("memo");
              }}
            >
              <p className="text-xs">Memos</p>
            </button>
          </div>
        </div>
        <div className="border-b-[1px] border-emerald-900 flex flex-col">
          <div className="p-4 ">
            <p className="text-sm w-full text-center text-emerald-900">
              Purchase type
            </p>
          </div>
          <div className="flex w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("storeType") === "all" ||
                !searchParams.get("storeType")
                  ? "w-1/2 border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-1/2 border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleStoreClick("all");
              }}
            >
              <p className="text-xs">All purchases</p>
            </button>
            <button
              className={`${
                searchParams.get("storeType") === "online"
                  ? "w-1/2 border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-1/2 border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleStoreClick("online");
              }}
            >
              <p className="text-xs">Online</p>
            </button>
            <button
              className={`${
                searchParams.get("storeType") === "store"
                  ? "w-1/2 border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-1/2 border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleStoreClick("store");
              }}
            >
              <p className="text-xs">In-store</p>
            </button>
          </div>
        </div>
        <div className="border-b-[1px] border-emerald-900 flex flex-col">
          <div className="p-4 ">
            <p className="text-sm w-full text-center text-emerald-900">Sort</p>
          </div>
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("sort")?.includes("created_at") ||
                !searchParams.get("sort")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleSortClick("created_at");
              }}
            >
              {searchParams.get("sort")?.includes("created_at") ||
              !searchParams.get("sort") ? (
                <p className="text-xs">
                  {searchParams.get("sort")?.includes("-created_at") ||
                  !searchParams.get("sort")
                    ? "Created At (newest)"
                    : "Created At (oldest)"}
                </p>
              ) : (
                <p className="text-xs">Created at</p>
              )}
            </button>
            <button
              className={`${
                searchParams.get("sort")?.includes("return_date")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleSortClick("return_date");
              }}
            >
              {searchParams.get("sort")?.includes("return_date") ? (
                <p className="text-xs">
                  {searchParams.get("sort")?.includes("-return_date") ||
                  !searchParams.get("sort")
                    ? "Return Date (newest)"
                    : "Return Date (oldest)"}
                </p>
              ) : (
                <p className="text-xs">Return date</p>
              )}
            </button>
            <button
              className={`${
                searchParams.get("sort")?.includes("purchase_date")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleSortClick("purchase_date");
              }}
            >
              {searchParams.get("sort")?.includes("purchase_date") ? (
                <p className="text-xs">
                  {searchParams.get("sort")?.includes("-purchase_date") ||
                  !searchParams.get("sort")
                    ? "Purchase Date (newest)"
                    : "Purchase Date (oldest)"}
                </p>
              ) : (
                <p className="text-xs">Purchase date</p>
              )}
            </button>
            <button
              className={`${
                searchParams.get("sort")?.includes("price")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleSortClick("price");
              }}
            >
              {searchParams.get("sort")?.includes("price") ? (
                <p className="text-xs">
                  {searchParams.get("sort")?.includes("-price") ||
                  !searchParams.get("sort")
                    ? "Price ascending"
                    : "Price descending"}
                </p>
              ) : (
                <p className="text-xs">Price</p>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterItemsOptions = ({
  pathname,
  searchParams,
  onClose,
}: FilterOptionsProps) => {
  const handleSortClick = (name: string) => {
    const queryParams = new URLSearchParams(window.location.search);

    const currentSort = queryParams.get("sort");
    const currentDirection = currentSort?.includes("-") ? "desc" : "asc";

    let newDirection;
    if (currentSort === name && currentDirection === "asc") {
      newDirection = "desc";
    } else {
      newDirection = "asc";
    }

    const newSortValue = newDirection === "asc" ? name : `-${name}`;

    queryParams.set("sort", newSortValue);

    router.push(`${pathname}?${queryParams.toString()}`);
  };

  const router = useRouter();

  return (
    <div className={`overlay`}>
      <div className={`flex flex-col modal`}>
        <div className="border-b-[1px] border-emerald-900 flex ">
          <div className="p-4 flex w-full">
            <p className="text-center w-full text-orange-600 text-lg">Filter</p>
            <button onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="border-b-[1px] border-emerald-900 flex flex-col">
          <div className="p-4 ">
            <p className="text-sm w-full text-center text-emerald-900">Sort</p>
          </div>
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("sort")?.includes("created_at") ||
                !searchParams.get("sort")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleSortClick("created_at");
              }}
            >
              {searchParams.get("sort")?.includes("created_at") ||
              !searchParams.get("sort") ? (
                <p className="text-xs">
                  {searchParams.get("sort")?.includes("-created_at") ||
                  !searchParams.get("sort")
                    ? "Created At (newest)"
                    : "Created At (oldest)"}
                </p>
              ) : (
                <p className="text-xs">Created at</p>
              )}
            </button>
            <button
              className={`${
                searchParams.get("sort")?.includes("return_date")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleSortClick("return_date");
              }}
            >
              {searchParams.get("sort")?.includes("return_date") ? (
                <p className="text-xs">
                  {searchParams.get("sort")?.includes("-return_date") ||
                  !searchParams.get("sort")
                    ? "Return Date (newest)"
                    : "Return Date (oldest)"}
                </p>
              ) : (
                <p className="text-xs">Return date</p>
              )}
            </button>
            <button
              className={`${
                searchParams.get("sort")?.includes("purchase_date")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleSortClick("purchase_date");
              }}
            >
              {searchParams.get("sort")?.includes("purchase_date") ? (
                <p className="text-xs">
                  {searchParams.get("sort")?.includes("-purchase_date") ||
                  !searchParams.get("sort")
                    ? "Purchase Date (newest)"
                    : "Purchase Date (oldest)"}
                </p>
              ) : (
                <p className="text-xs">Purchase date</p>
              )}
            </button>
            <button
              className={`${
                searchParams.get("sort")?.includes("price")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleSortClick("price");
              }}
            >
              {searchParams.get("sort")?.includes("price") ? (
                <p className="text-xs">
                  {searchParams.get("sort")?.includes("-price") ||
                  !searchParams.get("sort")
                    ? "Price ascending"
                    : "Price descending"}
                </p>
              ) : (
                <p className="text-xs">Price</p>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
