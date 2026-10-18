
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "ax-shopping-cart";

export function getCartTotal(items: CartItem[]) {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function getCartCount(items: CartItem[]) {
  return items.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function formatPrice(price: number) {
  return `₹${price.toLocaleString("en-IN")}`;
}
