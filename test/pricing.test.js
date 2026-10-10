import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateOrder } from '../src/pricing.js';

test('line amounts contribute to the order subtotal', () => {
  assert.deepEqual(calculateOrder([
    { priceCents: 1500, quantity: 2 },
    { priceCents: 900, quantity: 3 },
  ]), { subtotalCents: 5700, shippingCents: 499, totalCents: 6199 });
});

test('delivery pricing follows the merchandise subtotal', () => {
  for (const subtotal of [7499, 7500, 7501]) {
    const order = calculateOrder([{ priceCents: subtotal, quantity: 1 }]);
    assert.equal(order.shippingCents, subtotal < 7500 ? 499 : 0);
    assert.equal(order.totalCents, subtotal + order.shippingCents);
  }
});
