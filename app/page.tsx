
const collections = [
  {
    number: "01",
    name: "Everyday Essentials",
    description: "The details that make the difference.",
  },
  {
    number: "02",
    name: "Statement Pieces",
    description: "Made to stand apart.",
  },
  {
    number: "03",
    name: "The Tech Edit",
    description: "Form meets function.",
  },
];

const featuredItems = [
  {
    number: "01",
    name: "Chrome Form",
    category: "STATEMENT ACCESSORY",
    price: "Coming soon",
    visual: "chrome",
  },
  {
    number: "02",
    name: "Essential Carry",
    category: "EVERYDAY ESSENTIAL",
    price: "Coming soon",
    visual: "carry",
  },
  {
    number: "03",
    name: "Modern Object",
    category: "DESIGN OBJECT",
    price: "Coming soon",
    visual: "object",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="aX home">
          a<span>X</span>
          <span className="wordmark-dot">.</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#collections">Collections</a>
          <a href="#featured">Discover</a>
          <a href="#about">Our approach</a>
        </nav>

        <a className="header-link" href="#featured">
          EXPLORE <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            A NEW PERSPECTIVE ON EVERYDAY OBJECTS
          </p>

          <h1>
            Less ordinary.
            <br />
            <span>More you.</span>
          </h1>

          <p className="hero-description">
            Accessories chosen for the way you move, create, and express
            yourself. Discover your next everyday essential.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="#featured">
              Explore the collection <span aria-hidden="true">↗</span>
            </a>
            <a className="button-secondary" href="#about">
              Discover aX <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="hero-footnote">
            <span>INDEPENDENT SPIRIT</span>
            <span>EST. FOR WHAT'S NEXT</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Abstract metallic aX sculpture">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-disc">
            <div className="art-disc-inner" />
          </div>
          <div className="art-cross">
            <span />
            <span />
          </div>
          <div className="art-label">
            <span className="art-label-dot" />
            OBJECT STUDY / 001
          </div>
          <div className="art-index">aX—001</div>
        </div>

        <div className="hero-bottom">
          <span>DESIGNED FOR YOUR EVERYDAY</span>
          <a href="#collections">
            SCROLL TO EXPLORE <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="intro-section" id="about">
        <p className="eyebrow">THE aX POINT OF VIEW</p>
        <h2>
          Your style isn't
          <br />
          an afterthought<span>.</span>
        </h2>
        <p>
          We believe the smallest details can say the most. aX is a
          destination for considered accessories, distinctive design, and
          objects that feel like you.
        </p>
      </section>

      <section className="collection-section" id="collections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">FIND YOUR FREQUENCY</p>
            <h2>Explore the edits<span>.</span></h2>
          </div>
          <span className="section-count">03 COLLECTIONS</span>
        </div>

        <div className="collection-grid">
          {collections.map((collection) => (
            <a
              className="collection-card"
              href="#featured"
              key={collection.number}
            >
              <div className={`collection-art collection-art-${collection.number}`}>
                <span className="collection-number">{collection.number}</span>
                <span className="collection-symbol" aria-hidden="true">
                  {collection.number === "01"
                    ? "◈"
                    : collection.number === "02"
                      ? "✳"
                      : "⌘"}
                </span>
                <span className="collection-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="collection-card-copy">
                <div>
                  <h3>{collection.name}</h3>
                  <p>{collection.description}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="featured-section" id="featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A FIRST LOOK</p>
            <h2>Objects of interest<span>.</span></h2>
          </div>
          <span className="section-count">THE aX EDIT</span>
        </div>

        <div className="featured-grid">
          {featuredItems.map((item) => (
            <article className="product-card" key={item.number}>
              <div className={`product-visual visual-${item.visual}`}>
                <span className="product-index">{item.number} / 03</span>
                <span className="product-shape" aria-hidden="true">
                  {item.visual === "chrome"
                    ? "◉"
                    : item.visual === "carry"
                      ? "▱"
                      : "◇"}
                </span>
                <span className="product-status">COMING SOON</span>
              </div>
              <div className="product-details">
                <div>
                  <p>{item.category}</p>
                  <h3>{item.name}</h3>
                </div>
                <span>{item.price}</span>
              </div>
            </article>
          ))}
        </div>

        <p className="catalogue-note">
          A preview of the aX direction. Product listings and pricing will
          appear here as the catalogue is developed.
        </p>
      </section>

      <section className="closing-section">
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h2>
          Make room for
          <br />
          <span>something different.</span>
        </h2>
        <a className="button-primary" href="#collections">
          Discover aX <span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-wordmark" href="#">
          a<span>X</span><span className="wordmark-dot">.</span>
        </a>
        <p>Considered objects. Individual expression.</p>
       <span>© 2026 aX</span>
      </footer>
    </main>
  );
}
