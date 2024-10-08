"use client";
import { useSearchBarContext } from "@/components/context/SearchBarContext";
import { BarcodeScanner } from "@/components/createForm/barcode/BarcodeScanner";
import { ProjectType } from "@/types/ProjectTypes";
import { ReceiptType } from "@/types/ReceiptTypes";

import Image from "next/image";
import Link from "next/link";
import React, { ChangeEvent, useState } from "react";
import { BeatLoader } from "react-spinners";

interface SearchAllItemsProps {
  projectData: ProjectType[];
  receiptData: ReceiptType[];
}

function SearchAllItems({ projectData, receiptData }: SearchAllItemsProps) {
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

  const [showScanner, setShowScanner] = useState(false);
  const [barcodeValue, setBarcodeValue] = useState("");

  const handleBarcodeResult = (barcodeValue: string) => {
    const matchingItems = receiptData
      .flatMap((receipt) => receipt.items)
      .filter((item) => {
        const barcodeMatch = item.barcode === barcodeValue;
        return barcodeMatch;
      });
    setSearchInput(barcodeValue);
    setBarcodeValue(barcodeValue);
    setFilteredItems(matchingItems);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase().trim();
    setSearchInput(e.target.value);
    const filteredProjects = projectData.filter(
      (project) => project.name && project.name.toLowerCase().includes(input)
    );

    setFilteredProjects(filteredProjects);

    const filteredReceipts = receiptData.filter(
      (receipt) => receipt.store && receipt.store.toLowerCase().includes(input)
    );

    setFilteredReceipts(filteredReceipts);

    const matchingItems = receiptData
      .flatMap((receipt) => receipt.items)
      .filter((item) => {
        const descriptionMatch =
          item.description && item.description.toLowerCase().includes(input);
        const barcodeMatch =
          item.barcode && item.barcode.toLowerCase().includes(input);

        return descriptionMatch || barcodeMatch;
      });

    setFilteredItems(matchingItems);
  };

  {
    receiptData === undefined && projectData === undefined && (
      <div>
        <BeatLoader loading={receiptData} size={15} color={"rgb(6 78 59)"} />
      </div>
    );
  }

  return (
    <div className="pb-[200px] w-full flex-col overflow-y-auto">
      <p className="text-xs mb-4 text-white">
        Search for all items and receipts by store, description, or barcode
      </p>
      <div className="w-full flex gap-4 items-center justify-center pb-4">
        <input
          className="bg-emerald-900  placeholder:text-sm placeholder:text-white border-[1px] border-white p-2 rounded-lg w-full text-white focus:outline-none"
          placeholder={`Search `}
          onChange={handleChange}
          value={searchInput}
        ></input>

        <div>
          <button
            type="button"
            className="w-[40px] h-[40px] border-[1px] border-white p-1 rounded-lg flex justify-center items-center "
            onClick={() => {
              setShowScanner(true);
            }}
            disabled={showScanner}
          >
            <Image
              src="/white/searchbarcode_white.png"
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
  filteredItems: any[];
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
  filteredReceipts: ReceiptType[];
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
  filteredProjects: ProjectType[];
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
