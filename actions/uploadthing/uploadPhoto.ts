import { utapi } from "@/app/server/uploadthing";

type UploadFileResponse =
  | { data: UploadData; error: null }
  | { data: null; error: UploadError };

type UploadData = {
  key: string;
  url: string;
  name: string;
  size: number;
};

type UploadError = {
  code: string;
  message: string;
  data: any;
};

type UploadResult = {
  url: string;
  key: string;
};

export async function handleUpload(
  receiptImage: string
): Promise<UploadResult[]> {
  const blob = await fetch(receiptImage).then((res) => res.blob());
  const file = new File([blob], "receipt_image"); // You can adjust the file name as needed
  const result = await utapi.uploadFiles(file); // Pass the File object to uploadFiles
  let uploadResults: UploadResult[] = [];

  const processResponse = (response: UploadFileResponse) => {
    if (response.data) {
      uploadResults.push({ url: response.data.url, key: response.data.key });
    } else if (response.error) {
      console.error(response.error.message);
    }
  };

  if (Array.isArray(result)) {
    result.forEach(processResponse);
  } else {
    processResponse(result as UploadFileResponse);
  }

  return uploadResults;
}
