import React, { useState, useEffect } from "react";
import { Edit3, Save, ShieldCheck, X, Plus, Trash2, LogOut } from "lucide-react";
import { money } from "../utils/formatters";
import LoginPanel from "../components/LoginPanel";

export default function AdminView({
  products,
  session,
  setSession,
  refreshProducts,
  apiUrl,
  logout,
}) {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session && session.token) {
      try {
        const base64Url = session.token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          alert("Your session has expired. Logging out automatically.");
          handleTriggerLogout();
        }
      } catch (e) {
        handleTriggerLogout();
      }
    }
  }, [session]);

  function handleTriggerLogout() {
    if (typeof logout === "function") {
      logout();
    } else {
      setSession(null);
      window.history.pushState(null, "", "/");
    }
  }

  if (!session)
    return (
      <section className="admin-view">
        <LoginPanel setSession={setSession} apiUrl={apiUrl} />
      </section>
    );

  if (session.user.role !== "admin")
    return (
      <section className="admin-view">
        <div className="empty">
          <h1>Admin access only</h1>
          <p>Your account can shop normally, but it cannot manage products.</p>
        </div>
      </section>
    );

  // ✅ Updated default schema blueprint structure mapping initial state parameters
  function initNewProduct() {
    setEditing({
      name: "",
      brand: "Ave Gifts",
      description: "",
      price: "",
      available: true,
      categoryIds: [],
      tags: [],
      variants: [],
      attributes: { material: "" },
      images: [], 
      rawImageFile: null, 
      isNew: true, 
    });
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const targetIdentifier = editing._id || editing.id || editing.slug;
      const endpoint = editing.isNew
        ? apiUrl + "/admin/fucktheadmin/products"
        : apiUrl + "/admin/fucktheadmin/products/" + encodeURIComponent(targetIdentifier);

      const method = editing.isNew ? "POST" : "PATCH";
      let config = {
        method: method,
        headers: { Authorization: "Bearer " + session.token },
      };

      // Clean structured array parameters before transmission package processing
      const processedCategories = Array.isArray(editing.categoryIds) 
        ? editing.categoryIds 
        : editing.categoryIds.split(",").map(c => c.trim()).filter(Boolean);
        
      const processedTags = Array.isArray(editing.tags) 
        ? editing.tags 
        : editing.tags.split(",").map(t => t.trim()).filter(Boolean);

      if (editing.isNew || editing.rawImageFile) {
        const formData = new FormData();
        formData.append("name", editing.name);
        formData.append("brand", editing.brand);
        formData.append("price", Number(editing.price));
        formData.append("description", editing.description.trim());
        formData.append("available", Boolean(editing.available));
        
        // Arrays and Objects must be appended as JSON strings when using multipart Form-Data
        formData.append("categoryIds", JSON.stringify(processedCategories));
        formData.append("tags", JSON.stringify(processedTags));
        formData.append("variants", JSON.stringify(editing.variants || []));
        formData.append("attributes", JSON.stringify(editing.attributes || {}));

        if (editing.rawImageFile) {
          formData.append("image", editing.rawImageFile);
        }
        config.body = formData;
      } else {
        const payload = {
          name: editing.name,
          brand: editing.brand,
          price: Number(editing.price),
          description: editing.description.trim(),
          available: Boolean(editing.available),
          categoryIds: processedCategories,
          tags: processedTags,
          variants: editing.variants || [],
          attributes: editing.attributes || {},
          images: editing.images
        };
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(payload);
      }

      const response = await fetch(endpoint, config);
      
      if (response.status === 401) {
        setEditing(null);
        setSaving(false);
        alert("Your session has expired or is invalid. Redirecting to login...");
        handleTriggerLogout();
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not save product");

      setMessage(data.message || "Product saved successfully");
      setEditing(null);
      refreshProducts();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  // Helper method for managing array item injection structures for multi-variants
  function addVariantRow() {
    const currentVariants = editing.variants || [];
    setEditing({
      ...editing,
      variants: [...currentVariants, { sku: "", name: "", stock: 0 }]
    });
  }

  function updateVariantField(index, key, val) {
    const currentVariants = [...(editing.variants || [])];
    currentVariants[index] = { 
      ...currentVariants[index], 
      [key]: key === "stock" ? Number(val) : val 
    };
    setEditing({ ...editing, variants: currentVariants });
  }

  function removeVariantRow(index) {
    setEditing({
      ...editing,
      variants: (editing.variants || []).filter((_, i) => i !== index)
    });
  }

  // ... (Keep existing handleDelete loop as is)

  return (
    <section className="admin-view">
      <div className="admin-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
          <ShieldCheck size={26} />
          <div>
            <h1>Admin Dashboard</h1>
            <p>Signed in as {session.user.email}.</p>
          </div>
        </div>
        <button onClick={handleTriggerLogout} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "#374151", color: "white", border: "none", borderRadius: "6px", padding: "8px 16px", cursor: "pointer" }}>
          <LogOut size={16} /> Log Out
        </button>
      </div>

      {/* Metrics Section */}
      <div className="metrics">
        <article><span>Products</span><strong>{products.length}</strong></article>
        <article><span>Available</span><strong>{products.filter((p) => p.available).length}</strong></article>
        <article><span>Highest price</span><strong>{money(Math.max(0, ...products.map((p) => p.price)))}</strong></article>
        <article onClick={initNewProduct} style={{ cursor: "pointer", border: "2px dashed #ccc", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Plus size={20} style={{ marginBottom: "4px" }} /><strong>Add New</strong>
        </article>
      </div>

      {message && <p className="status-message">{message}</p>}

      {/* Admin Table Product Loop Listing */}
      <div className="admin-table">
        {products.map((product) => (
          <div key={product._id || product.id || product.slug} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 0", borderBottom: "1px solid #eee" }}>
            <span style={{ flex: 1 }}><strong>[{product.brand || "No Brand"}]</strong> {product.name}</span>
            <span>{money(product.price)}</span>
            <span style={{ color: product.available ? "green" : "red" }}>{product.available ? "In stock" : "Unavailable"}</span>
            <button onClick={() => setEditing({ ...product, isNew: false, rawImageFile: null })}>
              <Edit3 size={16} /> Edit
            </button>
            {/* Delete button component layout omitted for brief code scannability visualization */}
          </div>
        ))}
      </div>

      {/* Editing / Creation Modal Context Workspace Layout Window */}
      {editing && (
        <div className="dialog-backdrop" role="presentation" onClick={() => setEditing(null)}>
          <form className="edit-dialog" onSubmit={saveProduct} onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", overflowY: "auto", width: "500px", padding: "20px" }}>
            <button className="close-button" type="button" onClick={() => setEditing(null)}><X size={18} /></button>
            <h2>{editing.isNew ? "Add new product" : "Edit product"}</h2>
            
            <label>Name<input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required /></label>
            <label>Brand<input value={editing.brand || ""} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} required /></label>
            <label>Price in Ksh<input type="number" min="0" value={editing.price || ""} onChange={(e) => setEditing({ ...editing, price: e.target.value })} required /></label>
            <label>Description (Supports Markdown formatting structures)<textarea rows="6" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} required /></label>
            
            <label>Categories (Separate with commas)<input placeholder="e.g. rosaries, sacramentals" value={Array.isArray(editing.categoryIds) ? editing.categoryIds.join(", ") : editing.categoryIds} onChange={(e) => setEditing({ ...editing, categoryIds: e.target.value })} /></label>
            <label>Tags (Separate with commas)<input placeholder="e.g. rosary, mary, prayer" value={Array.isArray(editing.tags) ? editing.tags.join(", ") : editing.tags} onChange={(e) => setEditing({ ...editing, tags: e.target.value })} /></label>
            
            <label>Material Attribute Material Field<input placeholder="e.g. Glass and alloy" value={editing.attributes?.material || ""} onChange={(e) => setEditing({ ...editing, attributes: { ...editing.attributes, material: e.target.value } })} /></label>

            {/* Structured Sub-Form Segment Block Layer for Dynamic Product Variant Allocations */}
            <fieldset style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "12px", margin: "14px 0" }}>
              <legend style={{ padding: "0 6px", fontSize: "13px", fontWeight: "bold" }}>Product Inventory Stock Variants</legend>
              {(editing.variants || []).map((variant, index) => (
                <div key={index} style={{ display: "flex", gap: "6px", marginBottom: "8px", alignItems: "center" }}>
                  <input placeholder="SKU (e.g. ROS-BLU)" style={{ flex: 1 }} value={variant.sku || ""} onChange={(e) => updateVariantField(index, "sku", e.target.value)} required />
                  <input placeholder="Name (e.g. Blue glass)" style={{ flex: 2 }} value={variant.name || ""} onChange={(e) => updateVariantField(index, "name", e.target.value)} required />
                  <input type="number" placeholder="Stock" style={{ width: "70px" }} value={variant.stock ?? ""} onChange={(e) => updateVariantField(index, "stock", e.target.value)} required />
                  <button type="button" onClick={() => removeVariantRow(index)} style={{ backgroundColor: "#ef4444", color: "white", padding: "4px" }}><Trash2 size={14} /></button>
                </div>
              ))}
              <button type="button" onClick={addVariantRow} style={{ marginTop: "6px", fontSize: "12px", padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}><Plus size={14} /> Add Variant Row Option</button>
            </fieldset>

            {/* Media Upload and Save controls remain standard mapping elements */}
            <fieldset style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "12px", margin: "12px 0" }}>
              <legend style={{ padding: "0 6px", fontSize: "14px", fontWeight: "bold" }}>Product Presentation Image Block</legend>
              <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <input type="file" accept="image/*" onChange={(e) => setEditing({ ...editing, rawImageFile: e.target.files[0] })} required={editing.isNew} />
              </label>
              {!editing.isNew && (
                <label style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
                  Or Explicit Image Direct URL
                  <input type="url" value={editing.images?.[0] || ""} onChange={(e) => setEditing({ ...editing, images: [e.target.value] })} />
                </label>
              )}
            </fieldset>

            <label className="check-row"><input type="checkbox" checked={editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} /> Available to customers</label>
            <button className="checkout" disabled={saving}><Save size={18} /> {saving ? "Saving..." : editing.isNew ? "Create product" : "Save product"}</button>
          </form>
        </div>
      )}
    </section>
  );
}