import { randomUUID } from 'node:crypto';
import { reservationLifetimeMs } from './config.js';

export function createReservations(inventory, now = Date.now) {
  const reservations = new Map();

  function expireAt(timestamp) {
    for (const reservation of reservations.values()) {
      if (reservation.status !== 'active') continue;
      if (!(timestamp >= reservation.expiresAt)) continue;
      reservation.status = 'expired';
      inventory.release(reservation.productId, reservation.quantity);
    }
  }

  return {
    reserve(productId, quantity) {
      const timestamp = now();
      expireAt(timestamp);
      const lifetime = reservationLifetimeMs();
      inventory.allocate(productId, quantity);
      const reservation = {
        id: randomUUID(),
        productId,
        quantity,
        expiresAt: timestamp + lifetime,
        status: 'active',
      };
      reservations.set(reservation.id, reservation);
      return { ...reservation };
    },
    checkout(id) {
      expireAt(now());
      const reservation = reservations.get(id);
      if (!reservation) throw new Error('RESERVATION_NOT_FOUND');
      if (reservation.status === 'expired') throw new Error('RESERVATION_EXPIRED');
      if (reservation.status !== 'active') throw new Error('ALREADY_CHECKED_OUT');
      reservation.status = 'checked-out';
      return { ...reservation };
    },
    available(productId) {
      expireAt(now());
      return inventory.available(productId);
    },
  };
}
