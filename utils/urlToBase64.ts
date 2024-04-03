export function urlToBase64(url: string) {
  return new Promise((resolve, reject) => {
    // Fetch the image content from the URL
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Convert the retrieved Blob to base64
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject; // Handle potential errors
        reader.readAsDataURL(blob);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
