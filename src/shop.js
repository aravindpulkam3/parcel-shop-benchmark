import { catalog } from './catalog.js';
import { createInventory } from './inventory.js';
import { createReservations } from './reservations.js';
import { calculateOrder } from './pricing.js';

function orderLine(product, quantity) {
  return { productId: product.id, priceCents: product.priceCents, quantity };
}

export function createShop({ now = Date.now } = {}) {
  const products = new Map(catalog.map((product) => [product.id, product]));
  const reservations = createReservations(createInventory(catalog), now);

  return {
    reserve: reservations.reserve,
    available: reservations.available,
    checkout(reservationId) {
      const reservation = reservations.checkout(reservationId);
      const product = products.get(reservation.productId);
      const lines = [orderLine(product, reservation.quantity)];
      return { reservationId, lines, ...calculateOrder(lines) };
    },
  };
}
