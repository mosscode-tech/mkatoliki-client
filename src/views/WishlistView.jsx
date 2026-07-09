import React from "react";
import { Heart, Plus } from "lucide-react";
import { money } from "../utils/formatters";

export default function WishlistView({
  wishlistProducts,
  addToCart,
  toggleWishlist,
  setActiveProduct,
}) {
  if (!wishlistProducts.length) {
    return (
      <section className="empty-state">
        <h2>Your wishlist is empty</h2>
        <p>Tap the heart icon on products to save them.</p>
      </section>
    );
  }

  return (
    <section className="product-grid">
      {wishlistProducts.map((product) => {
        const productId = product._id || product.id;

        return (
          <article className="product-card" key={productId}>
            <button
              className="image-button"
              onClick={() => setActiveProduct(product)}
            >
              <img
                src={product.images?.[0] || "/placeholder.webp"}
                alt={product.name}
              />
            </button>

            <div className="product-body">
              <p>{product.brand}</p>

              <h2>{product.name}</h2>

              <span>{money(product.price)}</span>

              <div className="card-actions">
                <button onClick={() => addToCart(product)}>
                  <Plus size={18} /> Add
                </button>

                <button
                  className="icon liked"
                  onClick={() => toggleWishlist(productId)}
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}