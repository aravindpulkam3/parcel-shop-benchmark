import { createShop } from './shop.js';

const shop = createShop();
const reservation = shop.reserve('notebook', 2);
console.log(JSON.stringify(shop.checkout(reservation.id), null, 2));
