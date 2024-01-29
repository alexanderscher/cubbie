"use server";

import { UTApi } from "uploadthing/server";
const utapi = new UTApi();
export const deleteUploadThingImage = async (fileKey: string) => {
  const result = await utapi.deleteFiles(fileKey);
  console.log(fileKey);

  return result;
};
