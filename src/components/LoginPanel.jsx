import React from "react";
import { ShieldCheck } from "lucide-react";
import LoginForm from "./LoginForm";

export default function LoginPanel({ setSession, apiUrl }) {
  return (
    <div className="login-panel">
      <ShieldCheck size={34} />
      <h1>Admin Login</h1>
      <p>
        Use the admin account to manage products. Customers can continue
        shopping without logging in.
      </p>
      <LoginForm onLogin={setSession} apiUrl={apiUrl} />
    </div>
  );
}