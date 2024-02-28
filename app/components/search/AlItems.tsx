"use client";

import { BarcodeScanner } from "@/app/components/createForm/barcode/BarcodeScanner";
import { Item, Receipt } from "@/types/receipt";
import Image from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";

function SearchAllItems() {
  const [data, setData] = useState<Receipt[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const handleBarcodeResult = (barcodeValue: string) => {
    const matchingItems = data
      .flatMap((receipt) => receipt.items)
      .filter((item) => {
        const barcodeMatch = item.barcode === barcodeValue;
        return barcodeMatch;
      });

    setFilteredItems(matchingItems);
  };
  useEffect(() => {
    const fetchReceipts = async () => {
      const res = await fetch("/api/receipt");
      const data = await res.json();

      setData(data.receipts);
    };
    fetchReceipts();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.toLowerCase();

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
    <div className="pb-[30px] w-full">
      <div className="w-full flex gap-4 items-center justify-center">
        <input
          className="bg-emerald-900  placeholder:text-sm placeholder:text-white border-[1px] border-white p-2 rounded-md w-full"
          placeholder={`Search all items`}
          onChange={handleChange}
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
    </div>
  );
}

export default SearchAllItems;

// interface ResultsProps {
//   filteredData: Receipt[] | Item[];
// }

// const Results = ({ filteredData }: ResultsProps) => {
//   return (
//     <div>
//       {filteredData.map((receipt, index) => {
//         return (
//           <div key={index}>
//             <h1>{receipt.store}</h1>
//             <ul>
//               {receipt.items.map((item, index) => {
//                 return (
//                   <li key={index}>
//                     <h2>{item.description}</h2>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         );
//       })}
//     </div>
//   );
// };
