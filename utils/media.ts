export const convertHeic = async (f: File): Promise<File> => {
  const heic2any = require("heic2any").default;

  try {
    const blob: Blob = await heic2any({
      blob: f,
      toType: "image/jpeg",
      quality: 0.7,
    });

    const converted: File = new File([blob], `${f.name.slice(0, -5)}.jpg`, {
      type: "image/jpeg",
    });

    return converted;
  } catch (error) {
    console.error("Error converting HEIC to JPEG:", error);
    throw error; // Rethrow or handle as needed
  }
};
