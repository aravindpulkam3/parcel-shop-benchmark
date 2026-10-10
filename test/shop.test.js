import assert from 'node:assert/strict';
import test from 'node:test';
import { createShop } from '../src/shop.js';

test('orders include merchandise and delivery amounts', () => {
  const shop = createShop();
  const reservation = shop.reserve('notebook', 2);
  const order = shop.checkout(reservation.id);
  assert.equal(order.subtotalCents, 3000);
  assert.equal(order.shippingCents, 499);
  assert.equal(order.totalCents, 3499);
  assert.equal(shop.available('notebook'), 6);
});

test('large orders include delivery', () => {
  const shop = createShop();
  const order = shop.checkout(shop.reserve('notebook', 5).id);
  assert.equal(order.shippingCents, 0);
  assert.equal(order.totalCents, 7500);
});

test('invalid quantities leave stock unchanged', () => {
  const shop = createShop();
  for (const quantity of [0, -1, 1.5, NaN, '2']) {
    assert.throws(() => shop.reserve('notebook', quantity), /INVALID_QUANTITY/);
  }
  assert.equal(shop.available('notebook'), 8);
});

test('unavailable products and quantities are rejected', () => {
  const shop = createShop();
  assert.throws(() => shop.reserve('unknown', 1), /PRODUCT_NOT_FOUND/);
  assert.throws(() => shop.reserve('notebook', 9), /OUT_OF_STOCK/);
  assert.equal(shop.available('notebook'), 8);
});

test('an order consumes its reservation once', () => {
  const shop = createShop();
  const reservation = shop.reserve('pen-set', 2);
  shop.checkout(reservation.id);
  assert.throws(() => shop.checkout(reservation.id), /ALREADY_CHECKED_OUT/);
  assert.equal(shop.available('pen-set'), 10);
});

test('abandoned reservations return stock', () => {
  let timestamp = 10000;
  const shop = createShop({ now: () => timestamp });
  const reservation = shop.reserve('notebook', 2);
  timestamp += 20 * 60 * 1000;
  assert.throws(() => shop.checkout(reservation.id), /RESERVATION_EXPIRED/);
  assert.equal(shop.available('notebook'), 8);
  assert.equal(shop.available('notebook'), 8);
});

test('checkout requires a known reservation', () => {
  assert.throws(() => createShop().checkout('missing'), /RESERVATION_NOT_FOUND/);
});

test('returned reservation data does not change stored state', () => {
  const shop = createShop();
  const reservation = shop.reserve('pen-set', 1);
  reservation.quantity = 100;
  assert.equal(shop.checkout(reservation.id).lines[0].quantity, 1);
});
