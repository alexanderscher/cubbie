import RegularButton from "@/components/buttons/RegularButton";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import React, { useCallback, useEffect, useState } from "react";

const Filters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [openModal, setOpenModal] = React.useState(false);
  const [openSortModal, setOpenSortModal] = React.useState(false);
  const [openStatusModal, setOpenStatusModal] = React.useState(false);
  const { filteredItemData } = useSearchItemContext();
  const { filteredProjectData } = useSearchProjectContext();
  const { filteredReceiptData } = useSearchReceiptContext();
  const searchParams = useSearchParams();

  const determineLabel = (type: string | null) => {
    switch (type) {
      case "all":
        return "All items";
      case "current":
        return "Current items";
      case "returned":
        return "Returned items";
      default:
        return "All items";
    }
  };

  const determineStoreTypeLabel = (type: string | null) => {
    switch (type) {
      case "all":
        return "All purchases";
      case "online":
        return "Online purchases";
      case "store":
        return "In-store purchases";
      default:
        return "All purchases";
    }
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div>
      {pathname === "/" && filteredProjectData.length > 0 && (
        <div className="flex gap-2">
          <div className="relative">
            <FilterButton
              setOpenModal={setOpenModal}
              openModal={openModal}
              label={
                searchParams.get("archive") === "false" ||
                !searchParams.get("archive")
                  ? "Currect projects"
                  : "Archived projects"
              }
            />
            {openModal && pathname === "/" && (
              <>
                <FilterProjectOptions
                  router={router}
                  pathname={pathname}
                  onClose={() => setOpenModal(false)}
                  createQueryString={createQueryString}
                  searchParams={searchParams}
                />
                <Overlay onClose={() => setOpenModal(false)} />
              </>
            )}
          </div>

          <div className="relative">
            <SortButton
              openModal={openSortModal}
              setOpenModal={setOpenSortModal}
              label={"Sort by"}
            />
            {openSortModal && pathname === "/" && (
              <>
                <SortProjectOptions
                  router={router}
                  pathname={pathname}
                  onClose={() => setOpenSortModal(false)}
                  createQueryString={createQueryString}
                  searchParams={searchParams}
                />
                <Overlay onClose={() => setOpenSortModal(false)} />
              </>
            )}
          </div>
        </div>
      )}
      {pathname === "/receipts" && filteredReceiptData.length > 0 && (
        <div className="flex gap-2">
          <FilterButton
            setOpenModal={setOpenModal}
            openModal={openModal}
            label={determineStoreTypeLabel(searchParams.get("storeType"))}
          />

          <SortButton
            openModal={openSortModal}
            setOpenModal={setOpenSortModal}
            label={"All Purchases"}
          />
          <RegularButton
            styles="border-emerald-900 text-emerald-900 flex justify-between items-center gap-2"
            handleClick={() => {
              setOpenStatusModal(!openStatusModal);
            }}
          >
            <p className="text-xs">
              {searchParams.get("expired") === "false" ||
              !searchParams.get("expired")
                ? "Active receipts"
                : "Expired receipts"}
            </p>
            <Image
              src="/arrow_grey.png"
              width={8}
              height={8}
              alt="arrow"
              className="rotate-90"
            />
          </RegularButton>
        </div>
      )}
      {pathname === "/items" && filteredItemData.length > 0 && (
        <div className="flex gap-2">
          <FilterButton
            setOpenModal={setOpenModal}
            openModal={openModal}
            label={determineLabel(searchParams.get("type"))}
          />

          <SortButton
            openModal={openSortModal}
            setOpenModal={setOpenSortModal}
            label={"Sort by"}
          />
        </div>
      )}

      <div className="flex gap-2 ">
        <div className="">
          <>
            {openModal && pathname === "/receipts" && (
              <FilterReceiptOptions
                router={router}
                pathname={pathname}
                onClose={() => setOpenModal(false)}
                createQueryString={createQueryString}
                searchParams={searchParams}
              />
            )}
            {openSortModal && pathname === "/receipts" && (
              <SortReceiptOptions
                router={router}
                pathname={pathname}
                onClose={() => setOpenSortModal(false)}
                createQueryString={createQueryString}
                searchParams={searchParams}
              />
            )}
            {openStatusModal && pathname === "/receipts" && (
              <StatusReceiptOptions
                router={router}
                pathname={pathname}
                onClose={() => setOpenStatusModal(false)}
                createQueryString={createQueryString}
                searchParams={searchParams}
              />
            )}
          </>
          <>
            {openModal && pathname === "/items" && (
              <FilterItemsOptions
                router={router}
                pathname={pathname}
                onClose={() => setOpenModal(false)}
                createQueryString={createQueryString}
                searchParams={searchParams}
              />
            )}
            {openSortModal && pathname === "/items" && (
              <SortItemsOptions
                router={router}
                pathname={pathname}
                onClose={() => setOpenSortModal(false)}
                createQueryString={createQueryString}
                searchParams={searchParams}
              />
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default Filters;

interface FilterButtonProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
  label: string;
}

const FilterButton = ({
  setOpenModal,
  openModal,
  label,
}: FilterButtonProps) => {
  return (
    <RegularButton
      styles="border-emerald-900 text-emerald-900 flex justify-between items-center gap-2"
      handleClick={() => {
        setOpenModal(!openModal);
      }}
    >
      <p className="text-xs">{label}</p>
      <Image
        src="/arrow_grey.png"
        width={8}
        height={8}
        alt="arrow"
        className="rotate-90"
      />
    </RegularButton>
  );
};

const SortButton = ({ setOpenModal, openModal, label }: FilterButtonProps) => {
  const [sortLabel, setSortLabel] = useState("Sort by");
  const searchParams = useSearchParams();

  const sortFieldParam = searchParams.get("sort");

  useEffect(() => {
    if (sortFieldParam === "created_at") {
      setSortLabel("Created at (oldest)");
    }
    if (sortFieldParam === "-created_at") {
      setSortLabel("Created at (newest)");
    }
    if (sortFieldParam === "price") {
      setSortLabel("Price ascending");
    }
    if (sortFieldParam === "-price") {
      setSortLabel("Price descending");
    }
    if (sortFieldParam === "return_date") {
      setSortLabel("Return Date (oldest)");
    }
    if (sortFieldParam === "-return_date") {
      setSortLabel("Return Date (newest)");
    }
    if (sortFieldParam === "purchase_date") {
      setSortLabel("Purchase Date (oldest)");
    }
    if (sortFieldParam === "-purchase_date") {
      setSortLabel("Purchase Date (newest)");
    }
  }, [sortFieldParam]);

  return (
    <RegularButton
      styles="border-emerald-900 text-emerald-900 flex justify-between items-center gap-2"
      handleClick={() => {
        setOpenModal(!openModal);
      }}
    >
      <p className="text-xs">{sortLabel}</p>
      <Image
        src="/arrow_grey.png"
        width={8}
        height={8}
        alt="arrow"
        className="rotate-90"
      />
    </RegularButton>
  );
};

interface FilterOptionsProps {
  onClose: () => void;
  createQueryString: (name: string, value: string) => string;
  pathname: string;
  searchParams: URLSearchParams;
  router: any;
}

const FilterProjectOptions = ({
  pathname,
  searchParams,
  onClose,
  router,
}: FilterOptionsProps) => {
  const handleArchiveClick = (isArchived: string) => {
    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("archive", isArchived);
    router.push(`${pathname}?${queryParams.toString()}`);
  };

  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();
  return (
    <div className="absolute z-[1001]">
      <div
        className={`flex flex-col  bg-white rounded-lg z-[1000] shadow-lg w-[200px]`}
        onClick={handleModalContentClick}
      >
        <div className=" border-black flex flex-col">
          <div className="border-b-[1px] border-black flex ">
            <div className="p-2 flex w-full">
              <p className="text-center w-full text-black text-lg">Filter</p>
              <button className="text-black" onClick={onClose}>
                &times;
              </button>
            </div>
          </div>
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("archive") === "false" ||
                !searchParams.get("archive")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
              }`}
              onClick={() => {
                handleArchiveClick("false");
              }}
            >
              <p className="text-xs">Current Projects</p>
            </button>

            <button
              className={`${
                searchParams.get("archive") === "true"
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
              }`}
              onClick={() => {
                handleArchiveClick("true");
              }}
            >
              <p className="text-xs">Archived Projects</p>
            </button>
          </div>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

const SortProjectOptions = ({
  pathname,
  searchParams,
  onClose,
  router,
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

  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();
  return (
    <div className="absolute z-[1001]">
      <div
        className={`flex flex-col  bg-white rounded-lg z-[1000] shadow-lg w-[200px]`}
        onClick={handleModalContentClick}
      >
        <div className="border-b-[1px] border-black flex ">
          <div className="p-2 flex w-full">
            <p className="text-center w-full text-black text-lg">Sort</p>
            <button className="text-black" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className=" border-black flex flex-col">
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("sort")?.includes("created_at") ||
                !searchParams.get("sort")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                searchParams.get("sort")?.includes("price")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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

interface FilterOptionsProps {
  onClose: () => void;
  createQueryString: (name: string, value: string) => string;
  pathname: string;
  searchParams: URLSearchParams;
}
const FilterReceiptOptions = ({
  createQueryString,
  pathname,
  searchParams,
  onClose,
  router,
}: FilterOptionsProps) => {
  const handleStoreClick = (name: string) => {
    router.push(pathname + "?" + createQueryString("storeType", name));
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
        <div className="border-b-[1px] border-black flex ">
          <div className="p-2 flex w-full">
            <p className="text-center w-full text-black text-lg">Filter</p>
            <button className="text-black" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className=" border-black flex flex-col">
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("storeType") === "all" ||
                !searchParams.get("storeType")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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

const SortReceiptOptions = ({
  pathname,
  searchParams,
  onClose,
  router,
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
        <div className="border-b-[1px] border-black flex ">
          <div className="p-2 flex w-full">
            <p className="text-center w-full text-black text-lg">Sort</p>
            <button className="text-black" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className=" border-black flex flex-col">
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("sort")?.includes("created_at") ||
                !searchParams.get("sort")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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

const StatusReceiptOptions = ({
  createQueryString,
  pathname,
  searchParams,
  onClose,
  router,
}: FilterOptionsProps) => {
  const handleExpiredlick = (name: string) => {
    router.push(pathname + "?" + createQueryString("expired", name));
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
        <div className="border-b-[1px] border-black flex ">
          <div className="p-2 flex w-full">
            <p className="text-center w-full text-black text-lg">Status</p>
            <button className="text-black" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className=" border-black flex flex-col">
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("expired") === "false" ||
                !searchParams.get("expired")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
              }`}
              onClick={() => {
                handleExpiredlick("false");
              }}
            >
              <p className="text-xs">Active</p>
            </button>
            <button
              className={`${
                searchParams.get("expired") === "true"
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
              }`}
              onClick={() => {
                handleExpiredlick("true");
              }}
            >
              <p className="text-xs">Expired</p>
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
  router,
}: FilterOptionsProps) => {
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
        <div className="border-b-[1px] border-black flex ">
          <div className="p-4 flex w-full">
            <p className="text-center w-full text-black text-lg">Filter</p>
            <button onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className=" border-black flex flex-col">
          <div className="flex flex-col w-full p-4 gap-3 text-xs">
            <button
              className={`${
                searchParams.get("type")?.includes("all") ||
                !searchParams.get("type")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
              }`}
              onClick={() => {
                handleTypeClick("current");
              }}
            >
              <p>Current Items</p>
            </button>
            <button
              className={`${
                searchParams.get("type")?.includes("returned")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
              }`}
              onClick={() => {
                handleTypeClick("returned");
              }}
            >
              <p>Returned items</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SortItemsOptions = ({
  pathname,
  searchParams,
  onClose,
  router,
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
        <div className="border-b-[1px] border-black flex ">
          <div className="p-4 flex w-full">
            <p className="text-center w-full text-black text-lg">Sort</p>
            <button onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className=" border-black flex flex-col">
          <div className="flex flex-col w-full p-4 gap-3">
            <button
              className={`${
                searchParams.get("sort")?.includes("created_at") ||
                !searchParams.get("sort")
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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
                  ? "w-full border-[1px] p-2 border-black text-white rounded-md bg-black"
                  : "w-full border-[1px] p-2 border-black rounded-md"
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

interface OverlayProps {
  onClose: () => void;
}

const Overlay = ({ onClose }: OverlayProps) => {
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
  return (
    <div
      id="modal-overlay"
      className={`filter-overlay`}
      onClick={handleOverlayClick}
    ></div>
  );
};
