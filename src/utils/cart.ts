export const recalc = (cart: any) => {
  cart.total = cart.items.reduce((s: number, it: any) => s + it.price * it.quantity, 0);
  return cart;
};