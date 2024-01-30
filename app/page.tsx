"use client";
import { BarcodeScanner } from "@/app/components/Barcode";
import Header from "@/app/components/Header";
import Receipt from "@/app/components/Receipt";
import { useState } from "react";

export default function Home() {
  const [buttons, setButtons] = useState({
    receipt: true,
    item: false,
  });

  const handleClick = (e: string) => {
    if (e === "receipt") {
      setButtons({ receipt: true, item: false });
    }
    if (e === "item") {
      setButtons({ receipt: false, item: true });
    }
  };
  const [result, setResult] = useState("");

  const dataArray = [1, 2, 3, 4, 5];
  const [showScanner, setShowScanner] = useState(false);

  const handleResult = (result) => {
    console.log("Scanned barcode result:", result);
    setResult(result.text);
    setShowScanner(false); // Close scanner on successful scan
  };

  const handleError = (error) => {
    // console.error("Scanning error:", error);
  };

  const closeScanner = () => {
    setShowScanner(false); // Manual close function
  };

  return (
    <main className="flex flex-col ">
      <Header />
      <button onClick={() => setShowScanner(true)}>Open Scanner</button>
      {showScanner && (
        <div>
          <h1>Scan a Barcode</h1>
          <BarcodeScanner onResult={handleResult} onError={handleError} />
          <button onClick={closeScanner}>Close Scanner</button>
        </div>
      )}
      {result && <p>Scanned barcode: {result}</p>}

      <div className="grid grid-cols-3 gap-6">
        {dataArray.map((item, index) => (
          <div key={index}>
            <Receipt />
          </div>
        ))}
      </div>
    </main>
  );
}
