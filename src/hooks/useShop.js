import { useState, useEffect, useMemo, useCallback } from "react";
import { money } from "../utils/formatters";

const API_URL =
  import.meta.env.VITE_API_URL || "https://api.mkatoliki.co.ke/api";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "254105380740";
const ADMIN_PATHS = ["/adminmoscode", "/moscodeadmin"];

function getViewFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const pathname = window.location.pathname.replace(/\/$/, "");
  return params.get("admin") === "1" ||
    ADMIN_PATHS.some((path) => pathname.endsWith(path))
    ? "admin"
    : "shop";
}

export function useShop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("mkatoliki-cart") || "[]"),
  );
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("mkatoliki-wishlist") || "[]"),
  );
  const [session, setSession] = useState(() =>
    JSON.parse(localStorage.getItem("mkatoliki-session") || "null"),
  );
  const [activeProduct, setActiveProduct] = useState(null);
  const [view, setView] = useState(getViewFromLocation);

  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    sort: "popular",
    maxPrice: Number.MAX_SAFE_INTEGER,
    available: true,
  });

  // Fetch initial catalogue data
  const loadCatalogue = useCallback(async () => {
    setLoading(true);
    try {
      const [productResponse, categoryResponse] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`),
      ]);

      const [productData, categoryData] = await Promise.all([
        productResponse.json(),
        categoryResponse.json(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (error) {
      setProducts([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalogue();
  }, [loadCatalogue]);

  useEffect(() => {
    if (products.length > 0 && filters.maxPrice === Number.MAX_SAFE_INTEGER) {
      setFilters((current) => ({
        ...current,
        maxPrice: Math.max(...products.map((p) => p.price)),
      }));
    }
  }, [products, filters.maxPrice]);

  // Sync back/forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromLocation());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync persistent storages
  useEffect(() => {
    localStorage.setItem("mkatoliki-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("mkatoliki-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (session) {
      localStorage.setItem("mkatoliki-session", JSON.stringify(session));
    } else {
      localStorage.removeItem("mkatoliki-session");
    }
  }, [session]);

  // Derived filtered & sorted array
 // Filtered catalogue
const filteredProducts = useMemo(() => {
  const term = filters.search.toLowerCase();

  return products
    .filter((product) => {
      const matchesSearch = [
        product.name,
        product.description,
        product.brand,
        ...(product.tags || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);

      const productCategories =
        product.categoryIds?.map((c) => c.toLowerCase()) || [];

      const matchesCategory =
        filters.category === "all" ||
        productCategories.includes(filters.category.toLowerCase());

      return (
        matchesSearch &&
        matchesCategory &&
        product.price <= Number(filters.maxPrice) &&
        (!filters.available || product.available)
      );
    })
    .sort((a, b) => {
      if (filters.sort === "price-asc") return a.price - b.price;
      if (filters.sort === "price-desc") return b.price - a.price;
      if (filters.sort === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return (b.popularity || 0) - (a.popularity || 0);
    });
}, [products, filters]);   

const wishlistProducts = useMemo(() => {
  return products.filter((product) =>
    wishlist.includes(product._id)
  );
}, [products, wishlist]);

  // Memoized Cart Calculations
  const { cartTotal, cartCount } = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        acc.cartTotal += item.price * item.quantity;
        acc.cartCount += item.quantity;
        return acc;
      },
      { cartTotal: 0, cartCount: 0 },
    );
  }, [cart]);

  // Actions
  function addToCart(product, variant = product.variants?.[0]) {
    const productId = product._id; // Fallback safety catch
    const lineKey = `${productId}-${variant?.sku || "default"}`;

    setCart((items) => {
      const existing = items.find((item) => item.lineKey === lineKey);
      if (existing) {
        return items.map((item) =>
          item.lineKey === lineKey
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...items,
        {
          lineKey,
          productId,
          variantSku: variant?.sku,
          variantName: variant?.name,
          name: product.name,
          image: product.images?.[0],
          price: variant?.price || product.price,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(lineKey, quantity) {
    setCart((items) =>
      items.map((item) =>
        item.lineKey === lineKey
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }

  function removeFromCart(lineKey) {
    setCart((items) => items.filter((item) => item.lineKey !== lineKey));
  }

  function toggleWishlist(productId) {
    setWishlist((items) =>
      items.includes(productId)
        ? items.filter((id) => id !== productId)
        : [...items, productId],
    );
  }

  function logout() {
    setSession(null);
    setView("shop");
    window.history.pushState(null, "", "/");
    // Dispatch fake popstate so components tracking window.location update reactively
    window.dispatchEvent(new Event("popstate"));
  }

  async function checkout() {
    if (!cart.length) return;

    const orderItems = cart.map(
      ({ productId, variantSku, name, price, quantity }) => ({
        productId,
        variantSku,
        name,
        price,
        quantity,
      }),
    );

    let reference = `MK-${Date.now()}`;
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          currency: "KES",
          paymentMethod: "WhatsApp",
        }),
      });
      if (response.ok) {
        const order = await response.json();
        reference = order.reference || reference;
      }
    } catch (err) {
      reference = `MK-OFFLINE-${Date.now()}`;
    }

    const lines = cart.map(
      (item) =>
        `- ${item.quantity} x ${item.name}${item.variantName ? ` (${item.variantName})` : ""}: ${money(item.price * item.quantity)}`,
    );

    const text = [
      "Hello mkatoliki, I would like to place this order:",
      `Reference: ${reference}`,
      ...lines,
      `Total: ${money(cartTotal)}`,
      "Please confirm payment and delivery details.",
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );

    setCart([]);
  }

  // Legacy fallback binding
  if (typeof window !== "undefined") {
    document.logout = logout;
  }

  return {
    loading,
    products,
    categories,
    cart,
    wishlist,
    wishlistProducts,
    session,
    activeProduct,
    view,
    filters,
    filteredProducts,
    cartTotal,
    cartCount,
    setSession,
    setActiveProduct,
    setView,
    setFilters,
    loadCatalogue,
    addToCart,
    updateQuantity,
    removeFromCart,
    toggleWishlist,
    logout,
    checkout,
    API_URL,
  };
}
