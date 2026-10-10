export function createInventory(products) {
  const stock = new Map();
  for (const product of products) {
    stock.set(product.id, product.stock);
  }

  function available(productId) {
    if (!stock.has(productId)) throw new Error('PRODUCT_NOT_FOUND');
    return stock.get(productId);
  }

  return {
    available,
    allocate(productId, quantity) {
      if (!Number.isSafeInteger(quantity) || quantity <= 0) {
        throw new Error('INVALID_QUANTITY');
      }
      const remaining = available(productId) - quantity;
      if (remaining < 0) throw new Error('OUT_OF_STOCK');
      stock.set(productId, remaining);
    },
    release(productId, quantity) {
      stock.set(productId, available(productId) + quantity);
    },
  };
}
