export const formatCurrency = (
  amount: string,
  locale = "en-US",
  currency = "USD"
) => {
  if (amount === "") {
    return "";
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
};
