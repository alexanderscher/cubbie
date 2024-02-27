"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { useSearchContext } from "@/app/components/context/SearchContext";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import SearchBar from "@/app/components/search/SearchBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import path from "path";
import React, { useCallback, useEffect } from "react";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const [data, setData] = React.useState([]);
  const { setFilteredData, setIsLoading } = useSearchContext();
  const { setFilteredItemData } = useSearchItemContext();
  const [openModal, setOpenModal] = React.useState(false);
  const [itemsModal, setItemsModall] = React.useState(false);
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
      const fetchItems = async () => {
        const res = await fetch("/api/items");
        const data = await res.json();
        setData(data.items);
        setFilteredItemData(data.items);
      };
      fetchItems();
    }
  }, [pathname, setFilteredItemData, setIsLoading]);

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
      <div className="pb-4 flex justify-between items-center relative flex-wrap gap-4 mt-6">
        <SearchBar
          data={data}
          searchType={type}
          type={pathname === "/items" ? "item" : "receipt"}
        />

        <div className="relative flex gap-2 items-center">
          <div className="relative">
            <RegularButton
              styles={`border-[1px] border-emerald-900  ${
                openModal ? "bg-emerald-900 text-white" : "bg text-emerald-900"
              }`}
              handleClick={() => {
                setOpenModal(!openModal);

                false;
              }}
            >
              <p className="text-xs">Sort</p>
            </RegularButton>
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
    <div className="absolute right-0 mt-2 w-[250px] bg-white border border-gray-200 rounded-md shadow-lg z-10 pb-2">
      <div className="flex flex-col gap-6  text-sm  ">
        <div className="flex flex-col w-full  items-start">
          <p className="text-orange-600 p-2 border-b-[1px] w-full ">
            Receipt Type
          </p>
          <button
            className={`${
              searchParams.get("receiptType") === "all" ||
              !searchParams.get("receiptType")
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleTypeClick("all");
            }}
          >
            <p className="p-2"> Receipts & Memos</p>
          </button>
          <button
            className={`${
              searchParams.get("receiptType") === "receipt"
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleTypeClick("receipt");
            }}
          >
            <p className="p-2"> Receipts</p>
          </button>
          <button
            className={`${
              searchParams.get("receiptType") === "memo"
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleTypeClick("memo");
            }}
          >
            <p className="p-2"> Memos</p>
          </button>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-orange-600 p-2 border-b-[1px] w-full ">
            Filter by
          </p>

          <button
            className={`${
              searchParams.get("storeType") === "all" ||
              !searchParams.get("storeType")
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleStoreClick("all");
            }}
          >
            <p className="p-2">All purchases</p>
          </button>
          <button
            className={`${
              searchParams.get("storeType") === "online"
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleStoreClick("online");
            }}
          >
            <p className="p-2">Online purchases</p>
          </button>
          <button
            className={`${
              searchParams.get("storeType") === "store"
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleStoreClick("store");
            }}
          >
            <p className="p-2">In store purchases</p>
          </button>
        </div>
        <div className="flex flex-col items-start">
          <p className="text-orange-600 p-2 border-b-[1px] w-full ">Sort by</p>
          <button
            className={`${
              searchParams.get("sort")?.includes("created_at") ||
              !searchParams.get("sort")
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleSortClick("created_at");
            }}
          >
            {searchParams.get("sort")?.includes("created_at") ||
            !searchParams.get("sort") ? (
              <p className="p-2">
                {searchParams.get("sort")?.includes("-created_at") ||
                !searchParams.get("sort")
                  ? "Created At (newest)"
                  : "Created At (oldest)"}
              </p>
            ) : (
              <p className="p-2">Created at</p>
            )}
          </button>
          <button
            className={`${
              searchParams.get("sort")?.includes("return_date")
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleSortClick("return_date");
            }}
          >
            {searchParams.get("sort")?.includes("return_date") ? (
              <p className="p-2">
                {searchParams.get("sort")?.includes("-return_date")
                  ? "Return Date (newest)"
                  : "Return Date (oldest)"}
              </p>
            ) : (
              <p className="p-2">Return Date</p>
            )}
          </button>
          <button
            className={`${
              searchParams.get("sort")?.includes("purchase_date")
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleSortClick("purchase_date");
            }}
          >
            {searchParams.get("sort")?.includes("purchase_date") ? (
              <p className="p-2">
                {searchParams.get("sort")?.includes("-purchase_date")
                  ? "Purchase Date (newest)"
                  : "Purchase Date (oldest)"}
              </p>
            ) : (
              <p className="p-2">Purchase Date</p>
            )}
          </button>

          <button
            className={`${
              searchParams.get("sort")?.includes("price")
                ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
                : "text-sm  text-slate-400 w-full text-start"
            }`}
            onClick={() => {
              handleSortClick("price");
            }}
          >
            {searchParams.get("sort")?.includes("price") ? (
              <p className="p-2">
                {searchParams.get("sort")?.includes("-price")
                  ? "Price (lowest)"
                  : "Price (highest)"}
              </p>
            ) : (
              <p className="p-2">Price</p>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterItemsOptions = ({ pathname, searchParams }: FilterOptionsProps) => {
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
    <div className="absolute right-0 mt-2 w-[250px] bg-white border border-gray-200 rounded-md shadow-lg z-10 pb-2">
      <div className="flex flex-col items-start">
        <p className="text-orange-600 p-2 border-b-[1px] w-full ">Sort by</p>
        <button
          className={`${
            searchParams.get("sort")?.includes("created_at") ||
            !searchParams.get("sort")
              ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
              : "text-sm  text-slate-400 w-full text-start"
          }`}
          onClick={() => {
            handleSortClick("created_at");
          }}
        >
          {searchParams.get("sort")?.includes("created_at") ||
          !searchParams.get("sort") ? (
            <p className="p-2">
              {searchParams.get("sort")?.includes("-created_at") ||
              !searchParams.get("sort")
                ? "Created At (newest)"
                : "Created At (oldest)"}
            </p>
          ) : (
            <p className="p-2">Created at</p>
          )}
        </button>
        <button
          className={`${
            searchParams.get("sort")?.includes("return_date")
              ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
              : "text-sm  text-slate-400 w-full text-start"
          }`}
          onClick={() => {
            handleSortClick("return_date");
          }}
        >
          {searchParams.get("sort")?.includes("return_date") ? (
            <p className="p-2">
              {searchParams.get("sort")?.includes("-return_date")
                ? "Return Date (newest)"
                : "Return Date (oldest)"}
            </p>
          ) : (
            <p className="p-2">Return Date</p>
          )}
        </button>
        <button
          className={`${
            searchParams.get("sort")?.includes("purchase_date")
              ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
              : "text-sm  text-slate-400 w-full text-start"
          }`}
          onClick={() => {
            handleSortClick("purchase_date");
          }}
        >
          {searchParams.get("sort")?.includes("purchase_date") ? (
            <p className="p-2">
              {searchParams.get("sort")?.includes("-purchase_date")
                ? "Purchase Date (newest)"
                : "Purchase Date (oldest)"}
            </p>
          ) : (
            <p className="p-2">Purchase Date</p>
          )}
        </button>

        <button
          className={`${
            searchParams.get("sort")?.includes("price")
              ? "text-sm  text-emerald-900 bg-slate-100 w-full text-start"
              : "text-sm  text-slate-400 w-full text-start"
          }`}
          onClick={() => {
            handleSortClick("price");
          }}
        >
          {searchParams.get("sort")?.includes("price") ? (
            <p className="p-2">
              {searchParams.get("sort")?.includes("-price")
                ? "Price (lowest)"
                : "Price (highest)"}
            </p>
          ) : (
            <p className="p-2">Price</p>
          )}
        </button>
      </div>
    </div>
  );
};
