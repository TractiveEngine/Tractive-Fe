/**
 * Display formatters for dashboard numbers.
 *
 * Confirmed from the live admin dashboard responses: amounts come back as whole
 * Naira (e.g. totalSpent 13500 = ₦13,500, not kobo), so the symbol is ₦. This is
 * the single place to change it if the backend ever switches units.
 */
export const CURRENCY_SYMBOL = "₦";

export const formatCurrency = (value: number | null | undefined): string => {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return `${CURRENCY_SYMBOL}${n.toLocaleString()}`;
};

/** Compact money for tight spots like chart axes: ₦210M, ₦4.5K, ₦0. */
export const formatCompactCurrency = (value: number | null | undefined): string => {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const compact = (v: number, unit: string) =>
    `${(v % 1 === 0 ? v.toFixed(0) : v.toFixed(1))}${unit}`;
  let body: string;
  if (abs >= 1e9) body = compact(abs / 1e9, "B");
  else if (abs >= 1e6) body = compact(abs / 1e6, "M");
  else if (abs >= 1e3) body = compact(abs / 1e3, "K");
  else body = String(abs);
  return `${sign}${CURRENCY_SYMBOL}${body}`;
};

export const formatNumber = (value: number | null | undefined): string => {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  return n.toLocaleString();
};

/** "+25%" / "-4%" with sign, from a raw percent number (25 → "+25%"). */
export const formatDelta = (value: number | null | undefined): string => {
  const n = typeof value === "number" && Number.isFinite(value) ? value : 0;
  const sign = n > 0 ? "+" : "";
  return `${sign}${n}%`;
};
