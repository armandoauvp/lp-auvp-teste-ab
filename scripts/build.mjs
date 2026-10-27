/**
 * Monta o site completo em `dist/`:
 *
 *     dist/index.html        índice (indice/index.html)
 *     dist/institucional/    página institucional (Vite + React)
 *     dist/escola/           LP da Escola (Vite)
 *     dist/auvp-sempre/      página da AUVP Sempre (HTML puro, copiada)
 *     dist/<pagina>/         demais páginas clonadas do WordPress (idem),
 *                            com a base comum em dist/comum/
 *     dist/<pagina>/b.html   versão B de uma página em teste A/B
 *
 * A mesma pasta serve o GitHub Pages e a Vercel. O que muda entre os dois é
 * só o prefixo de URL, lido do ambiente:
 *
 * - `SITE_BASE_PATH`: subcaminho do site. No Pages de repositório de projeto
 *   é `/<repo>`; na Vercel e em domínio próprio fica vazio.
 * - `SITE_URL`: endereço público, usado na URL canônica do institucional. Na
 *   Vercel, se ausente, sai de `VERCEL_PROJECT_PRODUCTION_URL`.
 *
 * - `SITE_INDEXAVEL`: só com `true` o site pode ser indexado por buscadores.
 *   Sem ela (homologação), todo HTML sai com `noindex, nofollow` e a raiz
 *   ganha um robots.txt que bloqueia tudo, para o homolog não concorrer com o
 *   auvp.com.br no Google.
 *
 * Antes de montar, confere o experiments.json; no fim, confere se cada teste
 * A/B tem as duas versões no site. Qualquer erro derruba o build com a lista
 * do que corrigir. Ver docs/AB-TESTING.md.
 *
 * Ver docs/DEPLOY.md.
 */
import { spawnSync } from "node:child_process";
import {
  copyFile,
  cp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  canonical,
  validarExperimentos,
  validarSite,
} from "../ab/validacao.js";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");

// A action `configure-pages` devolve "/" quando o site fica na raiz.
const base = (process.env.SITE_BASE_PATH ?? "").replace(/\/+$/, "");
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = (
  process.env.SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "")
).replace(/\/+$/, "");

/*
 * Versões B que não são um `b.html` escrito à mão, e sim outra página deste
 * repositório: o build copia o index.html montado dela para `<página>/b.html`.
 * Os arquivos de CSS, JS e imagens continuam na pasta de origem (os caminhos
 * são absolutos), e o canonical é trocado pelo da versão A.
 *
 * Encerrar um desses testes é apagar a linha daqui e o teste do
 * experiments.json, no mesmo PR.
 */
const versoesMontadas = {
  // Teste "escola-institucional": a LP da Escola (A) contra a institucional (B).
  "/escola/": "institucional",
};

function falhar(titulo, erros) {
  console.error(`\n${titulo}\n${erros.map((e) => `  - ${e}`).join("\n")}\n`);
  process.exit(1);
}

// Confere o experiments.json antes de gastar tempo com o build das páginas.
const experimentos = JSON.parse(
  await readFile(path.join(root, "experiments.json"), "utf8"),
);
const errosDoJson = validarExperimentos(experimentos);
if (errosDoJson.length) falhar("experiments.json com problema:", errosDoJson);
const montadasSemTeste = Object.keys(versoesMontadas).filter(
  (pagina) => !experimentos.tests.some((t) => t.page === pagina),
);
if (montadasSemTeste.length) {
  falhar(
    "Testes A/B com problema:",
    montadasSemTeste.map(
      (pagina) =>
        `${pagina} tem versão B montada em versoesMontadas (scripts/build.mjs), mas não há teste para ${pagina} no experiments.json. Acrescente o teste ou apague a linha de versoesMontadas.`,
    ),
  );
}

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

// Versões B montadas a partir de outra página. Ver `versoesMontadas`.
for (const [pagina, origem] of Object.entries(versoesMontadas)) {
  const htmlA = await readFile(path.join(dist, pagina, "index.html"), "utf8");
  const htmlB = await readFile(path.join(dist, origem, "index.html"), "utf8");
  await writeFile(
    path.join(dist, pagina, "b.html"),
    trocarCanonical(htmlB, canonical(htmlA)),
  );
  console.log(`versão B de ${pagina} montada a partir de /${origem}/`);
}

/** Deixa no HTML só o canonical `href` (ou nenhum, se `href` for null). */
function trocarCanonical(html, href) {
  const semCanonical = html.replace(
    /[ \t]*<link\b[^>]*\brel\s*=\s*["']?canonical\b[^>]*>\n?/gi,
    "",
  );
  if (href === null) return semCanonical;
  return semCanonical.replace(
    /<head>/i,
    `<head>\n    <link rel="canonical" href="${href}" />`,
  );
}

// Homologação fora dos buscadores. Ver o comentário do topo.
if (process.env.SITE_INDEXAVEL !== "true") {
  const robots = '<meta name="robots" content="noindex, nofollow" />';
  const paginas = (await readdir(dist, { recursive: true })).filter(
    (f) => f.endsWith(".html") && !f.includes("~partytown"),
  );
  for (const pagina of paginas) {
    const arquivo = path.join(dist, pagina);
    const html = await readFile(arquivo, "utf8");
    const comMeta = /<meta\s+name="robots"[^>]*>/i.test(html)
      ? html.replace(/<meta\s+name="robots"[^>]*>/gi, robots)
      : html.replace(/<head>/i, `<head>\n    ${robots}`);
    await writeFile(arquivo, comMeta);
  }
  await writeFile(
    path.join(dist, "robots.txt"),
    "# Homologação: nada aqui deve ser indexado.\nUser-agent: *\nDisallow: /\n",
  );
  console.log(`noindex aplicado em ${paginas.length} páginas (homologação)`);
}

const errosDoSite = await validarSite(dist, experimentos);
if (errosDoSite.length) falhar("Testes A/B com problema:", errosDoSite);
if (experimentos.tests.length) {
  console.log(
    `testes A/B ligados: ${experimentos.tests.map((t) => `${t.id} (${t.page})`).join(", ")}`,
  );
}

console.log(`\nSite montado em ${dist} (base "${base || "/"}")`);
