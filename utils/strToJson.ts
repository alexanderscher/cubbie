export function convertStringToJson(str: string) {
  try {
    const jsonObj = JSON.parse(str);
    return jsonObj;
  } catch (error) {
    console.error("Error parsing JSON string:", error);
    return null; // or handle the error as appropriate for your application
  }
}
