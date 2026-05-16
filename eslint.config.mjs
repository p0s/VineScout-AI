import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import tseslint from "typescript-eslint";

const config = [
  {
    ignores: [
      ".next/**",
      ".turbo/**",
      ".vercel/**",
      "coverage/**",
      "dist/**",
      "logs/**",
      "node_modules/**",
      "out/**",
      "playwright-report/**",
      "screenshots/**",
      "temp/**",
      "test-results/**",
      "tmp/**",
      "next-env.d.ts"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  }
];

export default config;
