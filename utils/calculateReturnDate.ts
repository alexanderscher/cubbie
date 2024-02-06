import { addDays, subDays } from "date-fns";

// export function calculateReturnDate(startDate, daysUntilReturn) {
//   // Parse the start date if it's a string or use directly if it's already a Date object
//   const date = typeof startDate === "string" ? parseISO(startDate) : startDate;

//   // Add the specified number of days to the date
//   const newDate = addDays(date, daysUntilReturn);

//   // Format the new date as a string in the format YYYY-MM-DD
//   const result = format(newDate, "yyyy-MM-dd");

//   console.log(`Start Date: ${format(date, "yyyy-MM-dd")}`);
//   console.log(`Days Until Return: ${daysUntilReturn}`);
//   console.log(`New Date: ${result}`);

//   return result;
// }

export function calculateReturnDate(date, days) {
  const startDate = new Date(date);

  // Add or subtract days
  startDate.setDate(startDate.getDate() + days);

  // Format the new date as YYYY-MM-DD
  const year = startDate.getFullYear();
  const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
  const day = startDate.getDate().toString().padStart(2, "0");
  console.log(`${year}-${month}-${day}`);
  return `${year}-${month}-${day}`;
}

// Example usage
// console.log(calculateReturnDate("2023-01-01", 10));
