import React from "react";
import { ChevronLeft, Minus, Plus, Trash2, MessageCircle } from "lucide-react";
import { money } from "../utils/formatters";

export default function CartView({
  cart,
  cartTotal,
  checkout,
  removeFromCart,
  setView,
  updateQuantity,
}) {
  return (
    <section className="cart-view">
      <button className="back" onClick={() => setView("shop")}>
        <ChevronLeft size={18} /> Continue shopping
      </button>
      <h1>Your Cart</h1>
      {cart.length === 0 ? (
        <p className="empty">Your cart is ready when you are.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-lines">
            {cart.map((item) => (
              <article className="cart-line" key={item.lineKey}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.variantName}</p>
                  <strong>{money(item.price * item.quantity)}</strong>
                </div>
                <div className="quantity">
                  <button
                    onClick={() =>
                      updateQuantity(item.lineKey, item.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.lineKey, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="icon"
                  onClick={() => removeFromCart(item.lineKey)}
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>
          <aside className="summary">
            <h2>Order summary</h2>
            <p>Products are reserved after confirmation in WhatsApp.</p>
            <div>
              <span>Subtotal</span>
              <strong>{money(cartTotal)}</strong>
            </div>
            <button className="checkout" onClick={checkout}>
              <MessageCircle size={18} /> Checkout on WhatsApp
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}