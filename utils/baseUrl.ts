export function getBaseUrl() {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction
    ? process.env.NEXT_PUBLIC_APP_URL
    : "http://localhost:3000";
}
