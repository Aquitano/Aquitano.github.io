import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      ".astro/**",
      "dist/**",
      "node_modules/**",
      "public/**",
      "demo/**",
      "src/assets/**",
      "src/styles/**/*.css",
      "src/env.d.ts",
      "**/*.min.js",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.config({
    files: ["**/*.{ts,mts,cts}"],
    extends: tseslint.configs.recommended,
    languageOptions: { globals: globals.browser },
  }),
  { files: ["**/*.css"], plugins: { css }, language: "css/css", extends: ["css/recommended"] },
]);
