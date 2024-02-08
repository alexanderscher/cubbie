export const formatCurrencyValue = (value) => {
  // Remove any non-numeric characters except for the decimal point
  const numericValue = value.replace(/[^\d.]/g, "");

  // Convert to a number and format as a fixed two-decimal place string
  const formattedValue = `$${parseFloat(numericValue).toFixed(2)}`;

  return formattedValue;
};
