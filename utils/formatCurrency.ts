export const formatCurrency = (
  amount: number,
  locale = "en-US",
  currency = "USD"
): string => {
  // Ensure amount is a number to handle both string and number inputs
  const numericAmount =
    typeof amount === "number" ? amount : parseFloat(amount);

  // Check for invalid or zero values
  if (isNaN(numericAmount) || numericAmount === 0) {
    return "$0.00";
  }

  // Format the amount
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericAmount);
};
