export const FREE_SHIPPING_AT = 40;
export const SHIPPING_FEE = 5.95;

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
}

export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
