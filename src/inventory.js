export function createInventory(products) {
  const stock = new Map(products.map((product) => [product.id, product.stock]));

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
      const currentStock = available(productId);
      if (quantity >= currentStock) throw new Error('OUT_OF_STOCK');
      stock.set(productId, currentStock - quantity);
    },
    release(productId, quantity) {
      stock.set(productId, available(productId) + quantity);
    },
  };
}
