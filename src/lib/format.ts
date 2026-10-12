const NBSP = " ";

/** 12345 → "12 345" с неразрывным пробелом между группами. */
export function formatNumber(value: number): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = Math.abs(rounded).toString();
  const groups: string[] = [];
  for (let i = digits.length; i > 0; i -= 3) {
    groups.unshift(digits.slice(Math.max(0, i - 3), i));
  }
  return sign + groups.join(NBSP);
}

/** 12345 → "12 345 TJS". */
export function formatPrice(value: number, currency = "TJS"): string {
  return `${formatNumber(value)}${NBSP}${currency}`;
}

/** Процент скидки от старой цены к новой, целое число. */
export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
}

/** Склонение: 1 товар, 2 товара, 5 товаров. */
export function plural(n: number, forms: [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return forms[2];
  if (last > 1 && last < 5) return forms[1];
  if (last === 1) return forms[0];
  return forms[2];
}
