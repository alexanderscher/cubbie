export const formatCurrency = (
  amount: string,
  locale = "en-US",
  currency = "USD"
) => {
  if (amount === "") {
    return "";
  }
  if (amount === "0") {
    return "";
  }
  if (amount === "0.00") {
    return "";
  }
  if (amount === undefined) {
    return "";
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(amount));
};
