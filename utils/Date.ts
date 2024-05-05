import { addDays, format } from "date-fns";
import moment from "moment";

export function calculateReturnDate(dateString: string, days: number) {
  // Parse the date as a UTC date
  const date = new Date(dateString);
  const utcDate = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );

  // Create a new date object from the UTC timestamp and add the days
  const resultDate = new Date(utcDate);
  resultDate.setUTCDate(resultDate.getUTCDate() + days);

  // Format the date in MM/dd/yyyy format as a UTC date
  const formatted =
    resultDate.getUTCMonth() +
    1 +
    "/" +
    resultDate.getUTCDate() +
    "/" +
    resultDate.getUTCFullYear();
  return formatted.padStart(2, "0"); // Ensure double digits for month and day
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
