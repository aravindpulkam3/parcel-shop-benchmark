export function calculateOrder(lines) {
  let subtotalCents = 0;
  for (const line of lines) {
    subtotalCents += line.priceCents * line.quantity;
  }
  let shippingCents = 499;
  if (subtotalCents > 7500) {
    shippingCents = 0;
  }
  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
