import React, { useState } from "react";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { money } from "../utils/formatters";
import ReactMarkdown from "react-markdown";

export default function ProductDialog({ product, onClose, onAdd }) {
  const [variant, setVariant] = useState(product.variants?.[0]);
  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-title"
        onClick={(event) => event.stopPropagation()}
      >
        <img src={product.images?.[0]} alt={product.name} />
        <div>
          <button className="back" onClick={onClose}>
            <ChevronLeft size={18} /> Back
          </button>
          <p className="eyebrow">{product.brand}</p>
          <h1 id="product-title">{product.name}</h1>
          <strong>{money(variant?.price || product.price)}</strong>
          <p>{product.description}</p>
          <ReactMarkdown>{product.description}</ReactMarkdown>
          <label>
            Option
            <select
              value={variant?.sku || ""}
              onChange={(event) =>
                setVariant(
                  product.variants.find(
                    (item) => item.sku === event.target.value,
                  ),
                )
              }
            >
              {product.variants?.map((item) => (
                <option key={item.sku} value={item.sku}>
                  {item.name} - {item.stock} available
                </option>
              ))}
            </select>
          </label>
          <button className="checkout" onClick={() => onAdd(product, variant)}>
            <ShoppingBag size={18} /> Add to cart
          </button>
        </div>
      </section>
    </div>
  );
}