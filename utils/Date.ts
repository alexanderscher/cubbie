import moment from "moment";

export function calculateReturnDate(dateString: string, days: number) {
  // Parse the date as a UTC date
  const date = new Date(dateString + "T00:00:00Z"); // Ensure it's parsed as UTC

  // Add days to the date
  date.setUTCDate(date.getUTCDate() + days);

  // Format the date in MM/dd/yyyy format as a UTC date
  const formatted =
    (date.getUTCMonth() + 1).toString().padStart(2, "0") +
    "/" +
    date.getUTCDate().toString().padStart(2, "0") +
    "/" +
    date.getUTCFullYear();

  return formatted;
}

export function formatDateToMMDDYY(dateInput: Date | string) {
  // Parse the date as UTC and format it
  return moment.utc(dateInput).format("MM/DD/YY");
}

export const formatDateToYYYYMMDD = (dateInput: Date | string) => {
  if (!dateInput) return "";

  // Parse the date as UTC and format it
  return moment.utc(dateInput).format("YYYY-MM-DD");
};
