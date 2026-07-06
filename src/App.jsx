import React, { useEffect } from "react";
import { useShop } from "./hooks/useShop";
import { initAnalytics } from "./utils/analytics";
import { trackPageView } from "./utils/analytics";

// Layout & Components
import Header from "./components/Layout/Header";
import ProductDialog from "./components/ProductDialog";
import LoginDialog from "./components/LoginDialog";
import Footer from "./components/Layout/Footer";


// Pages
import ShopPage from "./views/ShopView";
import CartPage from "./views/CartView";
import AdminPage from "./views/AdminView";

import "./styles.css";

export default function App() {
  const shop = useShop();
  useEffect(() => {
  initAnalytics();
}, []);
useEffect(() => {
  trackPageView();
}, [shop.view]);

  return (
    <main>
      <Header 
        view={shop.view} 
        setView={shop.setView} 
        cartCount={shop.cartCount} 
      />

      {shop.view === "shop" && (
        <ShopPage
          categories={shop.categories}
          filters={shop.filters}
          filteredProducts={shop.filteredProducts}
          loading={shop.loading}
          setActiveProduct={shop.setActiveProduct}
          setFilters={shop.setFilters}
          wishlist={shop.wishlist}
          toggleWishlist={shop.toggleWishlist}
          addToCart={shop.addToCart}
          setView={shop.setView}
        />
      )}
      
      {shop.view === "cart" && (
        <CartPage
          cart={shop.cart}
          cartTotal={shop.cartTotal}
          checkout={shop.checkout}
          removeFromCart={shop.removeFromCart}
          setView={shop.setView}
          updateQuantity={shop.updateQuantity}
        />
      )}
      
      {shop.view === "admin" && (
        shop.session?.user?.role === "admin" ? (
          <AdminPage
            products={shop.products}
            session={shop.session}
            setSession={shop.setSession}
            refreshProducts={shop.loadCatalogue}
            apiUrl={shop.API_URL}
          />
        ) : (
          <div className="admin-login-wrapper" style={{ maxWidth: "400px", margin: "4rem auto", padding: "0 1rem" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Admin Portal</h2>
            <p style={{ color: "#666", marginBottom: "2rem" }}>Authorized access only.</p>
            <LoginDialog
              onClose={() => {
                shop.setView("shop");
                window.history.pushState(null, "", "/");
              }}
              apiUrl={shop.API_URL}
              onLogin={(nextSession) => {
                if (nextSession?.user?.role === "admin") {
                  shop.setSession(nextSession);
                } else {
                  alert("Access Denied: Admin role required.");
                }
              }}
            />
          </div>
        )
      )}

      {shop.activeProduct && (
        <ProductDialog 
          product={shop.activeProduct} 
          onClose={() => shop.setActiveProduct(null)} 
          onAdd={shop.addToCart} 
        />
      )}
      <Footer />
    </main>
  );
}