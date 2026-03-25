export function calculateBudgetTotals(items = [], discount = 0) {
  const normalizedItems = items.map((item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    const totalPrice = quantity * unitPrice;

    return {
      ...item,
      quantity,
      unit_price: unitPrice,
      total_price: totalPrice,
    };
  });

  const subtotal = normalizedItems.reduce((acc, item) => {
    return acc + item.total_price;
  }, 0);

  const normalizedDiscount = Number(discount) || 0;
  const total = Math.max(subtotal - normalizedDiscount, 0);

  return {
    items: normalizedItems,
    subtotal,
    discount: normalizedDiscount,
    total,
  };
}