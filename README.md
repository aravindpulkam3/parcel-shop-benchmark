# Parcel Shop

A small inventory reservation and checkout service for a shop selling stationery.
It uses Node.js ES modules and has no third-party dependencies.

```sh
npm test
npm run demo
```

Use Node.js 22 or later. `src/shop.js` exposes `createShop()`, with methods to
reserve a product, check out a reservation, and inspect available stock.
The demo exercises these methods without starting a server.

## Behavior

- Product IDs are exact catalog identifiers. Quantities must be positive integers.
- Reservations allocate available stock immediately and last 15 minutes.
- Checkout before the expiration instant returns an order; checkout at or after
  expiration rejects the request and returns its stock.
- Expired reservations are also reclaimed before a new reservation or stock read.
- A reservation can be checked out only once.
- Prices and totals are integer cents. Shipping is 499 cents below a 7,500-cent
  merchandise subtotal and free at or above that subtotal.

## Layout

`src/config.js` contains reservation policy. `src/inventory.js` manages stock,
`src/reservations.js` manages reservation state, and `src/pricing.js` calculates
order totals. `src/shop.js` connects these modules to the catalog.

State is held in memory for one shop instance. This is a single-process service
module, without persistence, accounts, network endpoints, taxes, or payment
processing. The caller supplies any authentication and durable storage required
by a deployed application.
