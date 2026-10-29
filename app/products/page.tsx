
"use client";

import { useEffect, useState } from "react";

type Product = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/products", {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load the catalogue."
          );
        }

        setProducts(data.products);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading products."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, []);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(price);

  return (
    <main className="catalogue-page">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="aX home">
          a<span>X</span>
          <span className="wordmark-dot">.</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/products" aria-current="page">
            Products
          </a>
        </nav>

        <a className="header-link" href="/">
          BACK HOME ↗
        </a>
      </header>

      <section className="catalogue-hero">
        <p className="eyebrow">THE aX CATALOGUE / 001</p>

        <h1>
          Objects of
          <br />
          <span>interest.</span>
        </h1>

        <p>
          Considered accessories. Distinctive design.
          Everyday objects with a point of view.
        </p>
      </section>

      <section className="catalogue-products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DISCOVER aX</p>
            <h2>
              Selected pieces<span>.</span>
            </h2>
          </div>

          <span className="section-count">
            {loading
              ? "LOADING"
              : `${String(products.length).padStart(2, "0")} ITEMS`}
          </span>
        </div>

        {loading ? (
          <div className="catalogue-note" role="status">
            Preparing the aX catalogue...
          </div>
        ) : error ? (
          <div className="catalogue-note" role="alert">
            <p>We couldn't load the catalogue.</p>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="catalogue-note">
            <h3>Your next favourite thing starts here.</h3>
            <p>
              The catalogue is being prepared. New products will
              appear here when they're added by the aX team.
            </p>
          </div>
        ) : (
          <div className="featured-grid">
            {products.map((product, index) => (
              <article className="product-card" key={product._id}>
                <div className="product-visual">
                  <span className="product-index">
                    {String(index + 1).padStart(2, "0")} /{" "}
                    {String(products.length).padStart(2, "0")}
                  </span>

                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span
                      className="product-shape"
                      aria-hidden="true"
                    >
                      aX
                    </span>
                  )}

                  <span className="product-status">
                    {product.stock > 0 ? "IN CATALOGUE" : "OUT OF STOCK"}
                  </span>
                </div>

                <div className="product-details">
                  <div>
                    <p>{product.category.toUpperCase()}</p>
                    <h3>{product.name}</h3>
                  </div>

                  <span>{formatPrice(product.price)}</span>
                </div>

                <p className="catalogue-product-description">
                  {product.description}
                </p>
              </article>
            ))}
          </div>
        )}

        <p className="catalogue-note">
          Product information is supplied by the aX catalogue.
          Availability and checkout will be enabled only when
          the relevant purchasing and fulfilment systems are ready.
        </p>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="/">
          a<span>X</span>
          <span className="wordmark-dot">.</span>
        </a>

        <p>Considered objects. Individual expression.</p>

        <span>© 2026 aX</span>
      </footer>
    </main>
  );
}
