import React from "react";
import {
  Filter,
  Heart,
  Plus,
  Search,
  ShoppingBag,
  MessageCircle,
} from "lucide-react";
import { money } from "../utils/formatters";
import Loading from "../components/Loading";

export default function ShopView({
  categories,
  filters,
  filteredProducts,
  loading,
  setActiveProduct,
  setFilters,
  wishlist,
  toggleWishlist,
  addToCart,
  setView,
}) {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Books, rosaries, sacramentals, art, gifts</p>
          <h1>mkatoliki</h1>
          <p>
            Thoughtful Catholic goods for prayer, home, parish life, and
            meaningful giving.
          </p>
          <div className="hero-actions">
            <button
              onClick={() =>
                document
                  .getElementById("catalogue")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <ShoppingBag size={18} /> Browse catalogue
            </button>
            <button className="secondary" onClick={() => setView("cart")}>
              <MessageCircle size={18} /> WhatsApp checkout
            </button>
          </div>
        </div>
      </section>
      <section className="toolbar" id="catalogue">
        <label className="search">
          <Search size={18} />
          <input
            value={filters.search}
            onChange={(event) =>
              setFilters({ ...filters, search: event.target.value })
            }
            placeholder="Search books, rosaries, medals..."
          />
        </label>
        <label>
          <Filter size={18} />
          <select
            value={filters.category}
            onChange={(event) =>
              setFilters({ ...filters, category: event.target.value })
            }
          >
            <option value="all">All categories</option>
            {categories.map((category) => (
              <option
                key={category.id || category.slug}
                value={category.id || category.slug}
              >
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort
          <select
            value={filters.sort}
            onChange={(event) =>
              setFilters({ ...filters, sort: event.target.value })
            }
          >
            <option value="popular">Popular</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price low to high</option>
            <option value="price-desc">Price high to low</option>
          </select>
        </label>
        <label className="range">
          Up to {money(filters.maxPrice)}
          <input
            type="range"
            min="900"
            max="10000"
            step="100"
            value={filters.maxPrice}
            onChange={(event) =>
              setFilters({ ...filters, maxPrice: event.target.value })
            }
          />
        </label>
      </section>
      <section className="category-strip" aria-label="Product categories">
        {categories.map((category) => (
          <button
            key={category.id || category.slug}
            onClick={() =>
              setFilters({ ...filters, category: category.id || category.slug })
            }
          >
            {category.name}
          </button>
        ))}
      </section>
      <section className="product-grid">
        {loading ? (
    <Loading text="Loading products..." />
  ) :filteredProducts.length === 0 ? (
    <div className="empty-state">
      <h3>No products found</h3>
      <p>Try changing your search or filters.</p>
    </div>
  ) : (filteredProducts.map((product) => (
          <article className="product-card" key={product.id || product.slug}>
            <button
              className="image-button"
              onClick={() => setActiveProduct(product)}
              aria-label={"View " + product.name}
            >
              <img
                src={product.images?.[0] || "/placeholder.webp"}
                alt={product.name}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.webp";
                }}
              />
            </button>
            <div className="product-body">
              <p>{product.brand}</p>
              <h2>
                <button onClick={() => setActiveProduct(product)}>
                  {product.name}
                </button>
              </h2>
              <span>{money(product.price)}</span>
              <div className="card-actions">
                <button onClick={() => addToCart(product)}>
                  <Plus size={18} /> Add
                </button>
                <button
                  className={
                    wishlist.includes(product.id) ? "icon liked" : "icon"
                  }
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Toggle wishlist"
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </article>
        )))}
      </section>
    </>
  );
}
