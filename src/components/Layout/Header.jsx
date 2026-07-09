import React from "react";
import {
  BookOpen,
  ShoppingBag,
  Heart,
} from "lucide-react";

export default function Header({
  view,
  setView,
  cartCount,
  wishlistCount = 0,
}) {
  return (
    <header className="site-header">
      <button
        className="brand"
        onClick={() => {
          setView("shop");
          window.history.pushState(null, "", "/");
        }}
        aria-label="Open shop"
      >
        <span className="brand-mark">m</span>

        <span className="brand-text">
          <strong>mkatoliki</strong>
          <small>Catholic Shop</small>
        </span>
      </button>

      <nav className="header-nav">
        <button
          className={view === "shop" ? "active" : ""}
          onClick={() => setView("shop")}
        >
          <BookOpen size={16} />
          <span>Shop</span>
        </button>

        <button
          className={view === "wishlist" ? "active" : ""}
          onClick={() => setView("wishlist")}
        >
          <Heart size={16} />
          <span>Wishlist</span>

          {wishlistCount > 0 && (
            <span className="cart-badge">
              {wishlistCount}
            </span>
          )}
        </button>

        <button
          className={view === "cart" ? "active" : ""}
          onClick={() => setView("cart")}
        >
          <ShoppingBag size={16} />
          <span>Cart</span>

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </button>
      </nav>
    </header>
  );
}