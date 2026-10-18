
const products = [
  {
    number: "01",
    name: "Chrome Form",
    category: "STATEMENT ACCESSORY",
    price: "Coming soon",
    symbol: "◉",
    slug: "chrome-form",
    description:
      "A bold design direction inspired by sculptural forms and polished metal.",
  },
  {
    number: "02",
    name: "Essential Carry",
    category: "EVERYDAY ESSENTIAL",
    price: "Coming soon",
    symbol: "▱",
    slug: "essential-carry",
    description:
      "An understated concept focused on everyday utility and considered design.",
  },
  {
    number: "03",
    name: "Modern Object",
    category: "DESIGN OBJECT",
    price: "Coming soon",
    symbol: "◇",
    slug: "modern-object",
    description:
      "A contemporary design concept where simplicity meets individuality.",
  },
];

export default function ProductsPage() {
  return (
    <main className="catalogue-page">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="aX home">
          a<span>X</span>
          <span className="wordmark-dot">.</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="/products">Products</a>
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
            <h2>Selected pieces<span>.</span></h2>
          </div>
          <span className="section-count">
            {String(products.length).padStart(2, "0")} ITEMS
          </span>
        </div>

        <div className="featured-grid">
          {products.map((product) => (
            <article className="product-card" key={product.slug}>
              <div className="product-visual">
                <span className="product-index">
                  {product.number} / 03
                </span>
                <span className="product-shape" aria-hidden="true">
                  {product.symbol}
                </span>
                <span className="product-status">COMING SOON</span>
              </div>

              <div className="product-details">
                <div>
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                </div>
                <span>{product.price}</span>
              </div>

              <p className="catalogue-product-description">
                {product.description}
              </p>
            </article>
          ))}
        </div>

        <p className="catalogue-note">
          These are concept listings for the initial store build.
          Real products, verified prices, and availability will be
          added before the store accepts orders.
        </p>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="/">
          a<span>X</span><span className="wordmark-dot">.</span>
        </a>
        <p>Considered objects. Individual expression.</p>
        <span>© 2026 aX</span>
      </footer>
    </main>
  );
}
