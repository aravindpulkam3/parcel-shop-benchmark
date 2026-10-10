export function calculateOrder(lines) {
  let subtotalCents = 0;
  for (const line of lines) {
    subtotalCents += line.priceCents * line.quantity;
  }
  const shippingCents = subtotalCents >= 7500 ? 0 : 499;
  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
