/**
 * Monta o site completo em `dist/`:
 *
 *     dist/index.html        índice (indice/index.html)
 *     dist/institucional/    página institucional (Vite + React)
 *     dist/escola/           LP da Escola (Vite)
 *     dist/auvp-sempre/      página da AUVP Sempre (HTML puro, copiada)
 *     dist/<pagina>/         demais páginas clonadas do WordPress (idem),
 *                            com a base comum em dist/comum/
 *
 * A mesma pasta serve o GitHub Pages e a Vercel. O que muda entre os dois é
 * só o prefixo de URL, lido do ambiente:
 *
 * - `SITE_BASE_PATH`: subcaminho do site. No Pages de repositório de projeto
 *   é `/<repo>`; na Vercel e em domínio próprio fica vazio.
 * - `SITE_URL`: endereço público, usado na URL canônica do institucional. Na
 *   Vercel, se ausente, sai de `VERCEL_PROJECT_PRODUCTION_URL`.
 *
 * Ver docs/DEPLOY.md.
 */
import { spawnSync } from "node:child_process";
import { copyFile, cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");

// A action `configure-pages` devolve "/" quando o site fica na raiz.
const base = (process.env.SITE_BASE_PATH ?? "").replace(/\/+$/, "");
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (
  process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "")
).replace(/\/+$/, "");

function run(workspace, env) {
  // Comando em string única: no Windows o `npm` é um .cmd e só roda via shell.
  const result = spawnSync(`npm run build -w ${workspace}`, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

await rm(dist, { recursive: true, force: true });

run("institucional", {
  BASE_PATH: `${base}/institucional/`,
  BUILD_OUT_DIR: path.join(dist, "institucional"),
  ...(siteUrl && { VITE_SITE_URL: `${siteUrl}/institucional` }),
});

run("escola", {
  BASE_PATH: `${base}/escola/`,
  BUILD_OUT_DIR: path.join(dist, "escola"),
});

await mkdir(dist, { recursive: true });
// Páginas em HTML puro, sem build: index.html, style.css, script.js e img/ vão
// como estão. Os caminhos são relativos, então funcionam na raiz e sob
// subcaminho do Pages. `comum/` guarda o cabeçalho, o rodapé e as imagens que
// as páginas vindas do WordPress compartilham.
const paginasEstaticas = [
  "comum",
  "auvp-sempre",
  "auvp-internacional",
  "nosso-processo",
  "quem-somos",
  "obrigado-aprovado",
  "obrigado-auvp-analitica",
  "resolva-aqui",
  "termos-de-uso",
  "politica-de-privacidade",
];
for (const pasta of paginasEstaticas) {
  await cp(path.join(root, pasta), path.join(dist, pasta), { recursive: true });
}
await copyFile(
  path.join(root, "indice/index.html"),
  path.join(dist, "index.html"),
);
// O Pages processa o site com Jekyll por padrão, e o Jekyll ignora pastas
// iniciadas por underscore. Nada aqui depende disso hoje, mas desligar evita
// a surpresa no dia em que depender.
await writeFile(path.join(dist, ".nojekyll"), "");

console.log(`\nSite montado em ${dist} (base "${base || "/"}")`);
