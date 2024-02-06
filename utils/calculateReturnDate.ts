export function calculateReturnDate(date: string, days: number) {
  const startDate = new Date(date);

  startDate.setDate(startDate.getDate() + days);

  const year = startDate.getFullYear();
  const month = (startDate.getMonth() + 1).toString().padStart(2, "0");
  const day = startDate.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
