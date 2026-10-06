export const FREE_SHIPPING_AT = 40;
export const SHIPPING_FEE = 5.95;

export function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
}
