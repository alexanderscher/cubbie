"use client";
import RegularButton from "@/app/components/buttons/RegularButton";
import { useSearchContext } from "@/app/components/context/SearchContext";
import { useSearchItemContext } from "@/app/components/context/SearchtemContext";
import SearchBar from "@/app/components/search/SearchBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useSearchProjectContext } from "@/app/components/context/SearchProjectContext";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const [data, setData] = React.useState([]);
  const { setFilteredProjectData, setisProjectLoading } =
    useSearchProjectContext();
  const { setFilteredData, setIsLoading } = useSearchContext();
  const {
    setFilteredItemData,
    refreshData,
    setRefreshData,

    setisItemLoading,
  } = useSearchItemContext();

  const [openModal, setOpenModal] = React.useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [addProjectOpen, setAddProjectOpen] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    if (pathname === "/") {
      const fetchProjects = async () => {
        setisProjectLoading(true);
        const res = await fetch("/api/project");
        const data = await res.json();
        setData(data.projects);
        setFilteredProjectData(data.projects);
        setisProjectLoading(false);
      };
      fetchProjects();
    }
  }, [pathname, setFilteredProjectData, setisProjectLoading]);

  useEffect(() => {
    if (pathname === "/receipts") {
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

  useEffect(() => {
    if (pathname === "/items") {
      console.log("fetching items");
      const fetchItems = async () => {
        setisItemLoading(true);
        const res = await fetch("/api/items");
        const data = await res.json();
        setData(data.items);
        setFilteredItemData(data.items);
        setRefreshData(false);
        setisItemLoading(false);
      };
      fetchItems();
    }
  }, [
    pathname,
    setFilteredItemData,
    refreshData,
    setRefreshData,
    setisItemLoading,
  ]);

  const projectColor =
    pathname === "/"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";

  const receiptColor =
    pathname === "/receipts"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";

  const itemColor =
    pathname === "/items"
      ? "bg-black border-black text-white"
      : "bg border-black text-black ";

  const handleExpiredlick = (name: string) => {
    router.push(pathname + "?" + createQueryString("expired", name));
  };
  return (
    <div className="flex flex-col gap-6 pb-4 ">
      <div className="flex gap-2 ">
        <RegularButton
          styles="bg border-emerald-900 text-emerald-900"
          handleClick={() => setAddProjectOpen(true)}
        >
          <p className="text-xs">Create Project</p>
        </RegularButton>
        <RegularButton
          href="/receipt-type"
          styles="bg-emerald-900 border-emerald-900 text-white"
        >
          <p className="text-xs">Create Receipt</p>
        </RegularButton>
      </div>
      <div className="flex justify-between pb-2">
        <h1 className="text-3xl text-emerald-900  ">{type}</h1>

        {addProjectOpen && (
          <CreateProject setAddProjectOpen={setAddProjectOpen} />
        )}
      </div>
      <div className="flex gap-2 flex-end">
        <RegularButton href="/" styles={projectColor}>
          <p className="text-xs">Projects</p>
        </RegularButton>
        <RegularButton href="/receipts" styles={receiptColor}>
          <p className="text-xs">Receipts</p>
        </RegularButton>

        <RegularButton styles={itemColor} href="/items">
          <p className="text-xs">Items</p>
        </RegularButton>
      </div>
      <div className=" flex justify-between items-center relative flex-wrap gap-4 ">
        <SearchBar data={data} searchType={type} />
        {pathname === "/receipts" && (
          <div className="flex w-full    ">
            <button
              className={`${
                searchParams.get("expired") === "false" ||
                !searchParams.get("expired")
                  ? "p-2  underline"
                  : "p-2  rounded-full"
              }`}
              onClick={() => {
                handleExpiredlick("false");
              }}
            >
              <p className="text-sm">Active</p>
            </button>
            <button
              className={`${
                searchParams.get("expired") === "true"
                  ? "p-2 underline"
                  : "p-2  rounded-full"
              }`}
              onClick={() => {
                handleExpiredlick("true");
              }}
            >
              <p className="text-sm">Expired</p>
            </button>
          </div>
        )}
        {pathname !== "/" && (
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
        )}

        <div className="flex gap-2 ">
          <div className="">
            {openModal && pathname === "/receipts" && (
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

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      onClose();
    }
  };

  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();
  return (
    <div id="modal-overlay" className={`overlay`} onClick={handleOverlayClick}>
      <div className={`flex flex-col modal`} onClick={handleModalContentClick}>
        <div className="border-b-[1px] border-emerald-900 flex ">
          <div className="p-2 flex w-full">
            <p className="text-center w-full text-orange-600 text-lg">Filter</p>
            <button className="text-orange-600" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>
        <div className="border-b-[1px] border-emerald-900 flex flex-col">
          <div className="pt-2">
            <p className="text-sm w-full text-center text-emerald-900">
              Receipt Type
            </p>
          </div>
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("receiptType") === "all" ||
                !searchParams.get("receiptType")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
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
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
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
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
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
          <div className="pt-2">
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
        <div className="border-b-[1px] border-emerald-900 flex flex-col">
          <div className="pt-2">
            <p className="text-sm w-full text-center text-emerald-900">
              Purchase type
            </p>
          </div>
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("storeType") === "all" ||
                !searchParams.get("storeType")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
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
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleStoreClick("online");
              }}
            >
              <p className="text-xs">Online purchases</p>
            </button>
            <button
              className={`${
                searchParams.get("storeType") === "store"
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleStoreClick("store");
              }}
            >
              <p className="text-xs">In-store purchases</p>
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
  createQueryString,
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

  const handleTypeClick = (name: string) => {
    router.push(pathname + "?" + createQueryString("type", name));
  };
  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      onClose();
    }
  };
  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();

  return (
    <div id="modal-overlay" className={`overlay`} onClick={handleOverlayClick}>
      <div className={`flex flex-col modal`} onClick={handleModalContentClick}>
        <div className="border-b-[1px] border-emerald-900 flex ">
          <div className="p-4 flex w-full">
            <p className="text-center w-full text-orange-600 text-lg">Filter</p>
            <button onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="border-b-[1px] border-emerald-900 flex flex-col">
          <div className="pt-2">
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
        <div className="border-b-[1px] border-emerald-900 flex flex-col">
          <div className="pt-2">
            <p className="text-sm w-full text-center text-emerald-900">Sort</p>
          </div>
          <div className="flex flex-col w-full p-4 gap-3 text-xs">
            <button
              className={`${
                searchParams.get("type")?.includes("all") ||
                !searchParams.get("type")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleTypeClick("all");
              }}
            >
              <p>All</p>
            </button>
            <button
              className={`${
                searchParams.get("type")?.includes("current")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleTypeClick("current");
              }}
            >
              <p>Current</p>
            </button>
            <button
              className={`${
                searchParams.get("type")?.includes("returned")
                  ? "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900"
                  : "w-full border-[1px] p-2 border-emerald-900 rounded-md"
              }`}
              onClick={() => {
                handleTypeClick("returned");
              }}
            >
              <p>Returned</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddItemModalProps {
  setAddProjectOpen: (value: boolean) => void;
}

const CreateProject = ({ setAddProjectOpen }: AddItemModalProps) => {
  const [project, setProject] = useState("");
  const [error, setError] = useState("");

  const createProject = async () => {
    const res = await fetch("/api/project", {
      method: "POST",
      body: JSON.stringify({
        name: project,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setError(data);
    console.log(data);
  };

  const handleSubmit = async () => {
    if (project === "") {
      setError("Please enter a project name");
    }
    if (project !== "") {
      await createProject();
      setAddProjectOpen(false);
    }
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (
      event.target instanceof HTMLDivElement &&
      event.target.id === "modal-overlay"
    ) {
      setAddProjectOpen(false);
    }
  };

  return (
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[2000]"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-md w-full">
        <div className="flex justify-between items-center border-b border-gray-200 px-5 py-4 bg-slate-100 rounded-t-lg">
          <h3 className="text-lg text-emerald-900">Create Project</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={() => setAddProjectOpen(false)}
          >
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-emerald-900">Project name*</p>
              <input
                type="text"
                name="description"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full p-2 border-[1px] border-emerald-900 rounded border-slate-300 focus:border-emerald-900 focus:outline-none"
              />
              {error && <p className="text-orange-900 text-xs">{error}</p>}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <RegularButton
              type="button"
              styles="bg-emerald-900 text-white border-emerald-900"
              handleClick={handleSubmit}
            >
              <p className="text-xs">Create Project</p>
            </RegularButton>
          </div>
        </div>
      </div>
    </div>
  );
};
