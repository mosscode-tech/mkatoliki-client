import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  { ignores: ["dist/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        document: "readonly",
        fetch: "readonly",
        localStorage: "readonly",
        window: "readonly"
      },
      parserOptions: { ecmaFeatures: { jsx: true } }
    },
    plugins: { react },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
      "no-unused-vars": ["warn", { varsIgnorePattern: "^React$" }]
    },
    settings: { react: { version: "detect" } }
  }
];
