import React from "react";
import { ShieldCheck, X } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginDialog({ onClose, onLogin, apiUrl }) {
  return (
    <div className="dialog-backdrop" role="presentation" onClick={onClose}>
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close login"
        >
          <X size={18} />
        </button>
        <ShieldCheck size={34} />
        <h1 id="login-title">Sign in</h1>
        <p>
          Shopping works without an account. Admins can sign in here to manage
          products.
        </p>
        <LoginForm onLogin={onLogin} apiUrl={apiUrl} />
      </section>
    </div>
  );
}