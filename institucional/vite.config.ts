import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/**
 * A base e a URL canônica vêm do ambiente porque mudam conforme o destino:
 * no Pages de repositório de projeto o site fica sob `/<repo>/institucional/`,
 * na Vercel sob `/institucional/`. Quem define as duas é `scripts/build.mjs`,
 * na raiz do repositório. Em `npm run dev` a página roda em `/`.
 *
 * `VITE_SITE_URL` é gravada em `process.env` antes de o Vite ler o ambiente,
 * para que o `%VITE_SITE_URL%` do index.html e o `import.meta.env` do código
 * vejam o mesmo valor, inclusive o padrão.
 */
process.env.VITE_SITE_URL = (
  process.env.VITE_SITE_URL ||
  "https://auvp.github.io/lp-escola-homolog/institucional"
).replace(/\/$/, "");

export default defineConfig({
  base: process.env.BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
});
