
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CART_STORAGE_KEY,
  formatPrice,
  getCartCount,
  getCartTotal,
  type CartItem,
} from "./lib/cart";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 1499,
    oldPrice: 2499,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85",
    tag: "POPULAR",
  },
  {
    id: 2,
    name: "Everyday Sneakers",
    category: "Fashion",
    price: 1299,
    oldPrice: 1999,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    tag: "TRENDING",
  },
  {
    id: 3,
    name: "Classic Wristwatch",
    category: "Accessories",
    price: 1899,
    oldPrice: 2999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=85",
    tag: "NEW",
  },
  {
    id: 4,
    name: "Everyday Backpack",
    category: "Accessories",
    price: 999,
    oldPrice: 1499,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
    tag: "PICK FOR YOU",
  },
  {
    id: 5,
    name: "Modern Sunglasses",
    category: "Fashion",
    price: 699,
    oldPrice: 1099,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=85",
    tag: "STYLE PICK",
  },
  {
    id: 6,
    name: "Premium Headphones",
    category: "Electronics",
    price: 2199,
    oldPrice: 3299,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=85",
    tag: "FEATURED",
  },
];

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Accessories",
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
const [cart, setCart] = useState<CartItem[]>([]);
const [cartReady, setCartReady] = useState(false);

useEffect(() => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (savedCart) {
      const parsed: unknown = JSON.parse(savedCart);

      if (Array.isArray(parsed)) {
        const validItems = parsed.filter(
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
        );

        setCart(validItems);
      }
    }
  } catch {
    console.warn("Could not load the saved aX cart.");
  } finally {
    setCartReady(true);
  }
}, []);

useEffect(() => {
  if (!cartReady) return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch {
    console.warn("Could not save the aX cart.");
  }
}, [cart, cartReady]);

function addToCart(product: (typeof products)[number]) {
  setCart((current) => {
    const existing = current.find((item) => item.id === product.id);

    if (existing) {
      return current.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...current,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      },
    ];
  });
}
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  return (
    <main className="store">
      <div className="announcement">
        YOUR NEXT FAVOURITE FIND IS HERE
        <span> | </span>
        WELCOME TO aX
      </div>

      <header className="store-header">
        <a href="/" className="store-logo">
          a<span>X</span>
        </a>

        <form
          className="store-search"
          onSubmit={(event) => event.preventDefault()}
        >
          <span aria-hidden="true">⌕</span>
          <input
            aria-label="Search products"
            placeholder="Search for products, accessories and more"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="store-actions">
          <a href="#products" className="account-link">
            <span>Welcome to aX</span>
            <strong>Explore store</strong>
          </a>
          <a href="/cart" className="cart-link">
            ♧ <span>Cart</span>
           <b>{getCartCount(cart)}</b>
          </a>
        </div>
      </header>
     
      <nav className="category-nav" aria-label="Product categories">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "category-active" : ""}
            onClick={() => {
              setCategory(item);
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      <section className="store-hero">
        <div className="store-hero-copy">
          <p className="store-eyebrow">MEET YOUR NEW FAVOURITES</p>
          <h1>
            Good finds.
            <br />
            <span>Better everyday.</span>
          </h1>
          <p className="store-hero-description">
            Discover accessories, everyday essentials and
            standout finds, all in one place.
          </p>
          <a href="#products" className="shop-button">
            Explore products <span>↗</span>
          </a>
          <p className="hero-caption">
            THE aX EDIT · YOUR STYLE, YOUR WAY
          </p>
        </div>

        <div className="store-hero-art">
          <img
            src={products[0].image}
            alt="Wireless headphones product showcase"
          />
          <div className="hero-floating-card">
            <span>THE DAILY EDIT</span>
            <strong>Find your next favourite.</strong>
            <a href="#products">Shop the collection ↗</a>
          </div>
          <span className="hero-side-label">aX / COLLECTION 001</span>
        </div>
      </section>

      <section className="benefit-strip">
        <div><span>01</span><strong>Curated finds</strong><small>Products worth discovering</small></div>
        <div><span>02</span><strong>Easy browsing</strong><small>Find what you are looking for</small></div>
        <div><span>03</span><strong>One growing store</strong><small>More categories over time</small></div>
      </section>

      <section className="store-products" id="products">
        <div className="store-section-heading">
          <div>
            <p className="store-eyebrow">THE aX COLLECTION</p>
            <h2>Explore products<span>.</span></h2>
            <p>Everyday picks and standout essentials.</p>
          </div>
          <span className="results-count">
            {filteredProducts.length} PRODUCTS
          </span>
        </div>

        <div className="store-category-pills">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "pill-active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="store-product-grid">
            {filteredProducts.map((product) => (
              <article className="store-product-card" key={product.id}>
                <div className="store-product-image">
                  <span className="product-tag">{product.tag}</span>
                  <button
                    className="wishlist-button"
                    aria-label={`Save ${product.name} to wishlist`}
                    onClick={(event) => {
                      event.currentTarget.textContent =
                        event.currentTarget.textContent === "♡" ? "♥" : "♡";
                    }}
                  >
                    ♡
                  </button>
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="store-product-info">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <div className="store-price">
                    <strong>
                      ₹{product.price.toLocaleString("en-IN")}
                    </strong>
                    <del>
                      ₹{product.oldPrice.toLocaleString("en-IN")}
                    </del>
                    <span>
                      {Math.round(
                        (1 - product.price / product.oldPrice) * 100
                      )}% off
                    </span>
                  </div>
                  <button
                    className="add-cart-button"
                   onClick={() => addToCart(product)}
                  >
                    + Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <h3>No matching products</h3>
            <p>Try another search or browse all categories.</p>
            <button
              className="add-cart-button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
            >
              Show all products
            </button>
          </div>
        )}

        <p className="demo-notice">
          Preview catalogue: product listings, prices and discounts
          are illustrative placeholders. They are not live offers
          or available-for-sale inventory.
        </p>
      </section>

      <section className="store-bottom-banner">
        <div>
          <p className="store-eyebrow">THIS IS JUST THE BEGINNING</p>
          <h2>Discover your next favourite.</h2>
          <p>aX is building a better way to find everyday essentials.</p>
        </div>
        <a href="#products" className="shop-button">
          Keep exploring ↗
        </a>
      </section>

      <footer className="store-footer">
        <a href="/" className="store-logo">a<span>X</span></a>
        <p>Discover more. Choose your own.</p>
        <span>© 2026 aX</span>
      </footer>
    </main>
  );
}
