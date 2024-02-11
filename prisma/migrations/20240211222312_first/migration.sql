-- CreateTable
CREATE TABLE "Receipt" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "store" TEXT NOT NULL,
    "card" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "tracking_number" TEXT NOT NULL,
    "bought_date" TIMESTAMP(3) NOT NULL,
    "days_until_return" INTEGER NOT NULL,
    "final_return_date" TIMESTAMP(3) NOT NULL,
    "receipt_image" TEXT NOT NULL,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "barcode" TEXT NOT NULL,
    "asset" BOOLEAN NOT NULL,
    "character" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "receipt_id" INTEGER NOT NULL,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Items" ADD CONSTRAINT "Items_receipt_id_fkey" FOREIGN KEY ("receipt_id") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
