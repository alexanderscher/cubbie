"use client";
import { useSearchBarContext } from "@/app/components/context/SearchBarContext";
import { BarcodeScanner } from "@/app/components/createForm/barcode/BarcodeScanner";
import { getProjects, getReceipts } from "@/app/lib/db";
import { Item, Project, Receipt } from "@/types/receipt";
import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";

function SearchAllItems() {
  const {
    searchInput,
    setSearchInput,
    filteredItems,
    setFilteredItems,
    filteredReceipts,
    setFilteredReceipts,
    filteredProjects,
    setFilteredProjects,
  } = useSearchBarContext();

  const [data, setData] = useState<Receipt[]>([]);
  const [projectData, setProjectData] = useState<Project[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");

  const handleBarcodeResult = (barcodeValue: string) => {
    const matchingItems = data
      .flatMap((receipt) => receipt.items)
      .filter((item) => {
        const barcodeMatch = item.barcode === barcodeValue;
        return barcodeMatch;
      });
    setSearchInput(barcodeValue);
    setBarcodeValue(barcodeValue);
    setFilteredItems(matchingItems);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjectData(data as Project[]);
    };
    fetchProjects();
  }, []);
  useEffect(() => {
    const fetchReceipts = async () => {
      const data = await getReceipts();
      console.log(data);

      setData(data as Receipt[]);
    };

    fetchReceipts();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase().trim();
    setSearchInput(e.target.value);

    const filteredProjects = projectData.filter(
      (project) => project.name && project.name.toLowerCase().includes(input)
    );

    setFilteredProjects(filteredProjects);

    const filteredReceipts = data.filter(
      (receipt) => receipt.store && receipt.store.toLowerCase().includes(input)
    );

    setFilteredReceipts(filteredReceipts);

    const matchingItems = data
      .flatMap((receipt) => receipt.items)
      .filter((item) => {
        const descriptionMatch =
          item.description && item.description.toLowerCase().includes(input);
        const barcodeMatch =
          item.barcode && item.barcode.toLowerCase().includes(input);
        const productIdMatch =
          item.product_id && item.product_id.toLowerCase().includes(input);

        return descriptionMatch || barcodeMatch || productIdMatch;
      });

    setFilteredItems(matchingItems);
  };

  return (
    <div className="pb-[200px] w-full flex-col overflow-y-auto">
      <p className="text-xs mb-4 text-white">
        Search for all items and receipts by store, description, barcode or
        product id
      </p>
      <div className="w-full flex gap-4 items-center justify-center pb-4">
        <input
          className="bg-emerald-900  placeholder:text-sm placeholder:text-white border-[1px] border-white p-2 rounded-md w-full text-white focus:outline-none"
          placeholder={`Search `}
          onChange={handleChange}
          value={searchInput}
        ></input>

        <div>
          <button
            type="button"
            className="w-[40px] h-[40px] border-[1px] border-white p-1 rounded-md flex justify-center items-center "
            onClick={() => {
              setShowScanner(true);
            }}
            disabled={showScanner}
          >
            <Image
              src="/searchbar_w.png"
              alt="barcode"
              width={100}
              height={100}
              className=""
            ></Image>
          </button>
        </div>
        {showScanner && (
          <div className="w-full">
            <h1>Scan a Barcode</h1>
            <BarcodeScanner
              setShowScanner={setShowScanner}
              onResult={(result) => {
                handleBarcodeResult(result.text);
                setShowScanner(false);
              }}
              onError={(error) => {}}
            />
            <button
              type="button"
              onClick={() => {
                setShowScanner(false);
              }}
            >
              Close Scanner
            </button>
          </div>
        )}
      </div>

      {filteredItems.length > 0 && searchInput && (
        <ItemResults filteredItems={filteredItems} />
      )}
      {searchInput && !barcodeValue && filteredReceipts.length > 0 && (
        <ReceiptResults filteredReceipts={filteredReceipts} />
      )}

      {searchInput && !barcodeValue && filteredProjects.length > 0 && (
        <ProjectResults filteredProjects={filteredProjects} />
      )}
    </div>
  );
}

export default SearchAllItems;

interface ResultsProps {
  filteredItems: Item[];
}

const ItemResults = ({ filteredItems }: ResultsProps) => {
  const { setSearchBarOpen } = useSearchBarContext();

  return (
    <div className="pb-4">
      <p className="text-orange-600 border-b-[1px]">Items</p>
      {filteredItems.map((item, index) => {
        return (
          <div key={index} className="pb-2">
            <Link href={`/item/${item.id}`}>
              <h1
                className="text-white"
                onClick={() => {
                  setSearchBarOpen(false);
                }}
              >
                {item.description}
              </h1>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

interface ReceiptResultsProps {
  filteredReceipts: Receipt[];
}

const ReceiptResults = ({ filteredReceipts }: ReceiptResultsProps) => {
  const { setSearchBarOpen } = useSearchBarContext();
  return (
    <div>
      <p className="text-orange-600 border-b-[1px]">Receipts</p>
      {filteredReceipts.map((receipt, index) => {
        return (
          <div key={index} className="pb-2">
            <Link href={`/receipt/${receipt.id}`}>
              <h1
                className="text-white"
                onClick={() => setSearchBarOpen(false)}
              >
                {receipt.store}
              </h1>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

interface ProjectResultsProps {
  filteredProjects: Project[];
}

const ProjectResults = ({ filteredProjects }: ProjectResultsProps) => {
  const { setSearchBarOpen } = useSearchBarContext();

  return (
    <div className="pb-4">
      <p className="text-orange-600 border-b-[1px]">Project</p>
      {filteredProjects.map((project, index) => {
        return (
          <div key={index} className="pb-2">
            <Link href={`/project/${project.id}`}>
              <h1
                className="text-white"
                onClick={() => {
                  setSearchBarOpen(false);
                }}
              >
                {project.name}
              </h1>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
