import RegularButton from "@/components/buttons/RegularButton";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
const clicked =
  "w-full border-[1px] p-2 border-emerald-900 text-white rounded-md bg-emerald-900 text";
const notClicked =
  "w-full border-[1px] p-2 border-emerald-900 rounded-md text-emerald-900";

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
            {openModal && (
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
            {openSortModal && (
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
          <div className="relative">
            <FilterButton
              setOpenModal={setOpenModal}
              openModal={openModal}
              label={determineStoreTypeLabel(searchParams.get("storeType"))}
            />
            {openModal && (
              <>
                <FilterReceiptOptions
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
              label={"All Purchases"}
            />
            {openSortModal && (
              <>
                <SortReceiptOptions
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
          <div className="relative">
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
            {openStatusModal && (
              <>
                <StatusReceiptOptions
                  router={router}
                  pathname={pathname}
                  onClose={() => setOpenStatusModal(false)}
                  createQueryString={createQueryString}
                  searchParams={searchParams}
                />
                <Overlay onClose={() => setOpenStatusModal(false)} />
              </>
            )}
          </div>
        </div>
      )}
      {pathname === "/items" && filteredItemData.length > 0 && (
        <div className="flex gap-2">
          <div className="relative">
            <FilterButton
              setOpenModal={setOpenModal}
              openModal={openModal}
              label={determineLabel(searchParams.get("type"))}
            />
            {openModal && pathname === "/items" && (
              <>
                <FilterItemsOptions
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
            {openSortModal && pathname === "/items" && (
              <>
                <SortItemsOptions
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

interface WrapperProps {
  children: React.ReactNode;
  handleModalContentClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}

const Wrapper = ({ children, handleModalContentClick }: WrapperProps) => {
  return (
    <div className="absolute z-[901] -top-0">
      <div
        className={`flex flex-col  bg-white rounded-lg shadow-xl w-[200px]`}
        onClick={handleModalContentClick}
      >
        <div className=" border-emerald-900 flex flex-col">
          <div className="flex flex-col w-full p-4 gap-3">{children}</div>
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
  router: any;
}

const FilterProjectOptions = ({
  pathname,
  searchParams,
  router,
}: FilterOptionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleArchiveClick = async (isArchived: string) => {
    setIsLoading(true);

    const queryParams = new URLSearchParams(window.location.search);
    queryParams.set("archive", isArchived);

    try {
      await router.push(`${pathname}?${queryParams.toString()}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();
  return (
    <Wrapper handleModalContentClick={handleModalContentClick}>
      <button
        className={`${
          searchParams.get("archive") === "false" ||
          !searchParams.get("archive")
            ? clicked
            : notClicked
        }`}
        onClick={() => {
          handleArchiveClick("false");
        }}
      >
        <p className="text-xs"> {isLoading ? "Loading" : "Current Projects"}</p>
      </button>

      <button
        className={`${
          searchParams.get("archive") === "true" ? clicked : notClicked
        }`}
        onClick={() => {
          handleArchiveClick("true");
        }}
      >
        <p className="text-xs">{isLoading ? "Loading" : "Archived Projects"}</p>
      </button>
    </Wrapper>
  );
};

const SortProjectOptions = ({
  pathname,
  searchParams,

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
    <Wrapper handleModalContentClick={handleModalContentClick}>
      <button
        className={`${
          searchParams.get("sort")?.includes("created_at") ||
          !searchParams.get("sort")
            ? clicked
            : notClicked
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
          searchParams.get("sort")?.includes("price") ? clicked : notClicked
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
    </Wrapper>
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

  router,
}: FilterOptionsProps) => {
  const handleStoreClick = (name: string) => {
    router.push(pathname + "?" + createQueryString("storeType", name));
  };

  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();
  return (
    <Wrapper handleModalContentClick={handleModalContentClick}>
      <button
        className={`${
          searchParams.get("storeType") === "all" ||
          !searchParams.get("storeType")
            ? clicked
            : notClicked
        }`}
        onClick={() => {
          handleStoreClick("all");
        }}
      >
        <p className="text-xs">All purchases</p>
      </button>
      <button
        className={`${
          searchParams.get("storeType") === "online" ? clicked : notClicked
        }`}
        onClick={() => {
          handleStoreClick("online");
        }}
      >
        <p className="text-xs">Online purchases</p>
      </button>
      <button
        className={`${
          searchParams.get("storeType") === "store" ? clicked : notClicked
        }`}
        onClick={() => {
          handleStoreClick("store");
        }}
      >
        <p className="text-xs">In-store purchases</p>
      </button>
    </Wrapper>
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

  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();
  return (
    <Wrapper handleModalContentClick={handleModalContentClick}>
      <button
        className={`${
          searchParams.get("sort")?.includes("created_at") ||
          !searchParams.get("sort")
            ? clicked
            : notClicked
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
            ? clicked
            : notClicked
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
            ? clicked
            : notClicked
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
          searchParams.get("sort")?.includes("price") ? clicked : notClicked
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
    </Wrapper>
  );
};

const StatusReceiptOptions = ({
  createQueryString,
  pathname,
  searchParams,

  router,
}: FilterOptionsProps) => {
  const handleExpiredlick = (name: string) => {
    router.push(pathname + "?" + createQueryString("expired", name));
  };

  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();
  return (
    <Wrapper handleModalContentClick={handleModalContentClick}>
      <button
        className={`${
          searchParams.get("expired") === "false" ||
          !searchParams.get("expired")
            ? clicked
            : notClicked
        }`}
        onClick={() => {
          handleExpiredlick("false");
        }}
      >
        <p className="text-xs">Active</p>
      </button>
      <button
        className={`${
          searchParams.get("expired") === "true" ? clicked : notClicked
        }`}
        onClick={() => {
          handleExpiredlick("true");
        }}
      >
        <p className="text-xs">Expired</p>
      </button>
    </Wrapper>
  );
};

const FilterItemsOptions = ({
  pathname,
  searchParams,

  createQueryString,
  router,
}: FilterOptionsProps) => {
  const handleTypeClick = (name: string) => {
    router.push(pathname + "?" + createQueryString("type", name));
  };

  const handleModalContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => e.stopPropagation();

  return (
    <Wrapper handleModalContentClick={handleModalContentClick}>
      <button
        className={`${
          searchParams.get("type")?.includes("all") || !searchParams.get("type")
            ? clicked
            : notClicked
        }`}
        onClick={() => {
          handleTypeClick("all");
        }}
      >
        <p className="text-xs">All</p>
      </button>
      <button
        className={`${
          searchParams.get("type")?.includes("current") ? clicked : notClicked
        }`}
        onClick={() => {
          handleTypeClick("current");
        }}
      >
        <p className="text-xs">Current Items</p>
      </button>
      <button
        className={`${
          searchParams.get("type")?.includes("returned") ? clicked : notClicked
        }`}
        onClick={() => {
          handleTypeClick("returned");
        }}
      >
        <p className="text-xs">Returned items</p>
      </button>
    </Wrapper>
  );
};

const SortItemsOptions = ({
  pathname,
  searchParams,
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
    <Wrapper handleModalContentClick={handleModalContentClick}>
      <button
        className={`${
          searchParams.get("sort")?.includes("created_at") ||
          !searchParams.get("sort")
            ? clicked
            : notClicked
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
            ? clicked
            : notClicked
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
            ? clicked
            : notClicked
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
          searchParams.get("sort")?.includes("price") ? clicked : notClicked
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
    </Wrapper>
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
