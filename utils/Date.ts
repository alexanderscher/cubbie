export function calculateReturnDate(date: string, days: number) {
  const startDate = new Date(date);

  startDate.setDate(startDate.getDate() + days);

  const year = startDate.getFullYear();
  const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
  const day = startDate.getDate().toString().padStart(2, "0");

  return `${month}/${day}/${year}`;
}

export function formatDateToMMDDYY(dateString: any): string {
  const date = new Date(dateString);
  let dd: string = date.getDate().toString();
  let mm: string = (date.getMonth() + 1).toString(); // January is 0!
  const yy: string = date.getFullYear().toString().substr(-2); // Get last 2 digits of year

  if (date.getDate() < 10) dd = "0" + dd;
  if (date.getMonth() + 1 < 10) mm = "0" + mm;

  return mm + "/" + dd + "/" + yy;
}

export const formatDateToYYYYMMDD = (date: any) => {
  if (!date) return "";

  // If date is already a string, assuming it's in ISO format
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = `0${dateObj.getMonth() + 1}`.slice(-2); // getMonth() is zero-based
  const day = `0${dateObj.getDate()}`.slice(-2);

  return `${year}-${month}-${day}`;
};
