import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const redirect = sessionStorage.redirect;
if (redirect) {
  delete sessionStorage.redirect;
  history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")).render(<App />);
