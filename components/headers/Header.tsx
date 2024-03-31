"use client";
import RegularButton from "@/components/buttons/RegularButton";
import SearchBar from "@/components/search/SearchBar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import styles from "./Header.module.css";
import { CreateReceipt } from "@/components/receiptComponents/CreateReceipt";
import { CreateProject } from "@/components/project/CreateProject";
import { useSearchReceiptContext } from "@/components/context/SearchReceiptContext";
import { useSearchItemContext } from "@/components/context/SearchItemContext";
import { useSearchProjectContext } from "@/components/context/SearchProjectContext";

interface HeaderProps {
  type: string;
}

const Header = ({ type }: HeaderProps) => {
  const [openModal, setOpenModal] = React.useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [addProjectOpen, setAddProjectOpen] = useState(false);
  const [addReceiptOpen, setAddReceiptOpen] = useState(false);
  const { filteredReceiptData } = useSearchReceiptContext();
  const { filteredItemData } = useSearchItemContext();
  const { filteredProjectData } = useSearchProjectContext();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

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
      <div className={` flex justify-between pb-2`}>
        <h1 className="text-2xl text-emerald-900  ">{type}</h1>

        {pathname === "/receipts" && filteredReceiptData.length > 0 && (
          <FilterButton openModal={openModal} setOpenModal={setOpenModal} />
        )}
        {pathname === "/items" && filteredItemData.length > 0 && (
          <FilterButton openModal={openModal} setOpenModal={setOpenModal} />
        )}
        {pathname === "/" && filteredProjectData.length > 0 && (
          <FilterButton openModal={openModal} setOpenModal={setOpenModal} />
        )}
        {addProjectOpen && (
          <CreateProject setAddProjectOpen={setAddProjectOpen} />
        )}

        {addReceiptOpen && (
          <CreateReceipt setAddReceiptOpen={setAddReceiptOpen} />
        )}
      </div>

      <div className=" flex justify-between items-center relative flex-wrap gap-4 ">
        <SearchBar searchType={type} />
        {pathname === "/receipts" && filteredReceiptData.length > 0 && (
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
              <p className="text-sm">Active Receipts</p>
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
              <p className="text-sm">Expired Receipts</p>
            </button>
          </div>
        )}

        <div className="flex gap-2 ">
          <div className="">
            {openModal && pathname === "/" && (
              <FilterProjectOptions
                pathname={pathname}
                onClose={() => setOpenModal(false)}
                createQueryString={createQueryString}
                searchParams={searchParams}
              />
            )}
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
      <AddButton
        setAddReceiptOpen={setAddReceiptOpen}
        setAddProjectOpen={setAddProjectOpen}
      />
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

const FilterProjectOptions = ({
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
          <div className="pt-2">
            <p className="text-sm w-full text-center text-black">Sort</p>
          </div>
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
        <div className="border-b-[1px] border-black flex ">
          <div className="p-2 flex w-full">
            <p className="text-center w-full text-black text-lg">Filter</p>
            <button className="text-black" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className="border-b-[1px] border-black flex flex-col">
          <div className="pt-2">
            <p className="text-sm w-full text-center text-black">Sort</p>
          </div>
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
        <div className="border-b-[1px] border-black flex flex-col">
          <div className="pt-2">
            <p className="text-sm w-full text-center text-black">
              Purchase type
            </p>
          </div>
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
        <div className="border-b-[1px] border-black flex ">
          <div className="p-4 flex w-full">
            <p className="text-center w-full text-black text-lg">Filter</p>
            <button onClick={onClose}>&times;</button>
          </div>
        </div>

        <div className="border-b-[1px] border-black flex flex-col">
          <div className="pt-2">
            <p className="text-sm w-full text-center text-black">Sort</p>
          </div>
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
        <div className="border-b-[1px] border-black flex flex-col">
          <div className="pt-2">
            <p className="text-sm w-full text-center text-black">Sort</p>
          </div>
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
              <p>In possesion</p>
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
              <p>Returned</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FilterButtonProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: boolean;
}

const FilterButton = ({ setOpenModal, openModal }: FilterButtonProps) => {
  return (
    <RegularButton
      styles="border-emerald-900 text-emerald-900 "
      handleClick={() => {
        setOpenModal(!openModal);
      }}
    >
      <p className="text-xs">Filter</p>
    </RegularButton>
  );
};

interface AddButtonProps {
  setAddReceiptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAddProjectOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddButton = ({
  setAddReceiptOpen,
  setAddProjectOpen,
}: AddButtonProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <div className="fixed z-10 bottom-8 right-8 shadow-xl w-12 h-12 flex items-center justify-center border-2 border-orange-600 bg-orange-600 text-white rounded-full ">
      <div className="relative">
        <button onClick={() => setIsModalVisible(!isModalVisible)} className="">
          <p className="text-xl">+</p>
        </button>
      </div>
      {isModalVisible && (
        <OptionsModal
          setAddProjectOpen={setAddProjectOpen}
          setAddReceiptOpen={setAddReceiptOpen}
          setIsModalVisible={setIsModalVisible}
        />
      )}
    </div>
  );
};

const OptionsModal = ({
  setAddReceiptOpen,
  setAddProjectOpen,
  setIsModalVisible,
}: AddButtonProps & {
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className="absolute -right-1 -bottom-1 w-48 bg-orange-300 shadow-lg rounded-md flex flex-col text-black z-200">
      <div className="flex flex-col text-start gap-3 relative p-4">
        <div
          className="bg-orange-100 hover:bg-orange-200 rounded-md p-3 cursor-pointer"
          onClick={() => setAddProjectOpen(true)}
        >
          <button className="text-sm text-orange-600">Create Project</button>
        </div>
        <div
          className="bg-orange-100 hover:bg-orange-200 rounded-md p-3 cursor-pointer"
          onClick={() => setAddReceiptOpen(true)}
        >
          <button className="text-sm text-orange-600">Create Receipt</button>
        </div>
        <div
          className="absolute -right-3 -top-3 shadow-xl w-12 h-12 flex items-center justify-center  bg-white text-orange-600 rounded-full cursor-pointer"
          onClick={() => setIsModalVisible(false)}
        >
          X
        </div>
      </div>
    </div>
  );
};
