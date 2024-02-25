"use server";

import { utapi } from "@/app/server/uploadthing";

export const deleteUploadThingImage = async (fileKey: string) => {
  const result = await utapi.deleteFiles(fileKey);

  return result;
};
