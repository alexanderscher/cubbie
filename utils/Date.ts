import { addDays, format } from "date-fns";
import moment from "moment";

export function calculateReturnDate(dateString: string, days: number) {
  const result = addDays(new Date(dateString), days);
  return format(result, "MM/dd/yyyy");
}

export function formatDateToMMDDYY(dateInput: Date | string) {
  // Parse the date as UTC and format it
  return moment.utc(dateInput).format("MM/DD/YY");
}

export const formatDateToYYYYMMDD = (
  dateInput: Date | string,
  timezone = "UTC"
) => {
  if (!dateInput) return "";

  // Use the provided timezone to format the date
  return moment.tz(dateInput, timezone).format("YYYY-MM-DD");
};
