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
        <span>
          <strong>mkatoliki</strong>
          <small>Catholic shop</small>
        </span>
      </button>
      <nav>
        <button
          className={view === "shop" ? "active" : ""}
          onClick={() => setView("shop")}
        >
          <BookOpen size={18} /> Shop
        </button>
        <button
          className={view === "cart" ? "active" : ""}
          onClick={() => setView("cart")}
        >
          <ShoppingBag size={18} /> Cart {cartCount ? `(${cartCount})` : ""}
        </button>
      </nav>
    </header>
  );
}