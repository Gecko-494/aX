
"use client";

import { useEffect, useState } from "react";
import {
  CART_STORAGE_KEY,
  formatPrice,
  getCartCount,
  getCartTotal,
  type CartItem,
} from "../lib/cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setCart(
            parsed.filter(
              (item): item is CartItem =>
                item !== null &&
                typeof item === "object" &&
                typeof item.id === "number" &&
                typeof item.name === "string" &&
                typeof item.price === "number" &&
                Number.isFinite(item.price) &&
                item.price >= 0 &&
                typeof item.image === "string" &&
                typeof item.quantity === "number" &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            )
          );
        }
      }
    } catch {
      console.warn("Could not load the saved aX cart.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      console.warn("Could not save the aX cart.");
    }
  }, [cart, ready]);

  function updateQuantity(id: number, change: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(
                  1,
                  Math.min(99, item.quantity + change)
                ),
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  if (!ready) {
    return (
      <main className="store cart-page">
        <p>Loading your cart...</p>
      </main>
    );
  }

  return (
    <main className="store cart-page">
      <header className="cart-page-header">
        <a href="/" className="store-logo">
          a<span>X</span>
        </a>
        <a href="/">Continue shopping</a>
      </header>

      <section className="cart-content">
        <div className="cart-title">
          <p className="store-eyebrow">YOUR aX SELECTION</p>
          <h1>Your shopping cart</h1>
          <p>
            {getCartCount(cart)}{" "}
            {getCartCount(cart) === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is waiting for you.</h2>
            <p>Explore the collection and add something you like.</p>
            <a href="/" className="shop-button">
              Explore products
            </a>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <a
                    href="/"
                    className="cart-item-image"
                    aria-label={`Continue shopping for ${item.name}`}
                  >
                    <img src={item.image} alt={item.name} />
                  </a>

                  <div className="cart-item-info">
                    <h2>{item.name}</h2>
                    <p>{formatPrice(item.price)} each</p>

                    <div className="cart-item-controls">
                      <div
                        className="quantity-control"
                        aria-label={`Quantity of ${item.name}`}
                      >
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          disabled={item.quantity >= 99}
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        className="remove-cart-item"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <strong className="cart-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </article>
              ))}
            </div>

            <aside className="cart-order-summary">
              <p className="store-eyebrow">ORDER SUMMARY</p>
              <div>
                <span>Items ({getCartCount(cart)})</span>
                <strong>{formatPrice(getCartTotal(cart))}</strong>
              </div>
              <div>
                <span>Shipping</span>
                <span>Calculated later</span>
              </div>
              <div className="cart-grand-total">
                <span>Subtotal</span>
                <strong>{formatPrice(getCartTotal(cart))}</strong>
              </div>

              <p className="cart-demo-note">
                This is a preview cart. Prices are illustrative, and
                checkout and shipping are not yet connected.
              </p>

              <button
                type="button"
                className="cart-checkout-button"
                disabled
              >
                Checkout coming soon
              </button>

              <a href="/" className="cart-continue-link">
                Continue shopping
              </a>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
