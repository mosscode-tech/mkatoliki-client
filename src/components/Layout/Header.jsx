import React from "react";
import { BookOpen, ShoppingBag } from "lucide-react";

export default function Header({ view, setView, cartCount }) {
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

      <nav>
        <button
          className={view === "shop" ? "active" : ""}
          onClick={() => setView("shop")}
        >
          <BookOpen size={16} />
          Shop
        </button>

        <button
          className={view === "cart" ? "active" : ""}
          onClick={() => setView("cart")}
        >
          <ShoppingBag size={16} />
          Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </nav>
    </header>
  );
}