// import { ourFileRouter } from "@/app/api/uploadthing/core";
// import { ItemInput } from "@/types/formTypes/form";
// import { useUploadThing } from "@/utils/uploadthing";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   const { startUpload, permittedFileInfo } = useUploadThing("imageUploader", {
//     onClientUploadComplete: (res) => {
//       (async () => {})().catch(console.error);
//     },
//   });
//   try {
//     const json = await request.json();

//     const {
//       type,
//       store,
//       card,
//       amount,
//       trackingNumber,
//       boughtDate,
//       daysUntilReturn,
//       finalReturnDate,
//       receiptImage,
//       receiptImageFile,
//       items,
//     } = json;

//     const requiredFields = ["type", "store", "amount", "items"];

//     const missingFields: string[] = [];

//     for (const field of requiredFields) {
//       if (!json[field]) {
//         missingFields.push(field);
//       }
//     }

//     if (missingFields.length > 0) {
//       return new NextResponse(
//         JSON.stringify({
//           error: `Missing or invalid fields: ${missingFields.join(", ")}`,
//         }),
//         {
//           status: 400,
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//     }

//     const itemsArray = items.map((item: ItemInput) => {
//       return {
//         description: item.description,
//         photo: item.photo,
//         photoFile: item.photoFile, // Ensure this exists in your item structure
//         price: item.price,
//         barcode: item.barcode,
//         asset: item.asset,
//         character: item.character,
//         product_id: item.product_id,
//       };
//     });

//     const receipt = await prisma.receipt.create({
//       data: {
//         type,
//         store,
//         card,
//         amount,
//         trackingNumber,
//         boughtDate,
//         daysUntilReturn,
//         finalReturnDate,
//         receiptImage,
//         items: {
//           create: itemsArray,
//         },
//       },
//     });

//     if (
//       receiptImageFile &&
//       receiptImageFile instanceof File &&
//       permittedFileInfo &&
//       receiptImage
//     ) {
//       startUpload([receiptImageFile]);
//     }

//     return new NextResponse(JSON.stringify(receipt), {
//       status: 201,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (err) {
//     return new NextResponse(JSON.stringify({ error: "Database error" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
