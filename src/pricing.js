export function calculateOrder(lines) {
  const subtotalCents = lines.reduce(
    (total, line) => total + line.priceCents * line.quantity,
    0,
  );
  const shippingCents = subtotalCents >= 7500 ? 0 : 499;
  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
