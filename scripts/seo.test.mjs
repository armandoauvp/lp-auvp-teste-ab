import { test } from "node:test";
import assert from "node:assert/strict";
import { arquivosSeo, PAGINAS } from "./lib/seo.mjs";

const URL_SITE = "https://www.auvp.com.br";
const arquivos = arquivosSeo(URL_SITE);

test("gera robots, llms e os sitemaps, com sitemap.xml igual ao índice", () => {
  assert.deepEqual(Object.keys(arquivos).sort(), [
    "llms.txt",
    "page-sitemap.xml",
    "robots.txt",
    "sitemap.xml",
    "sitemap_index.xml",
  ]);
  assert.equal(arquivos["sitemap.xml"], arquivos["sitemap_index.xml"]);
});

test("os endereços são absolutos no domínio principal", () => {
  for (const [nome, texto] of Object.entries(arquivos)) {
    const locais = [...texto.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    for (const l of locais)
      assert.ok(l.startsWith(`${URL_SITE}/`), `${nome}: ${l}`);
  }
  assert.match(
    arquivos["robots.txt"],
    /Sitemap: https:\/\/www\.auvp\.com\.br\/sitemap_index\.xml/,
  );
});

test("o índice aponta para as páginas da raiz e para o institucional", () => {
  assert.match(arquivos["sitemap_index.xml"], /\/page-sitemap\.xml/);
  assert.match(arquivos["sitemap_index.xml"], /\/institucional\/sitemap\.xml/);
  const locais = arquivos["page-sitemap.xml"].match(/<loc>/g);
  assert.equal(locais.length, PAGINAS.length);
});

test("llms.txt lista as páginas institucionais com o domínio novo", () => {
  assert.match(
    arquivos["llms.txt"],
    /\(https:\/\/www\.auvp\.com\.br\/quem-somos\/\)/,
  );
  assert.doesNotMatch(arquivos["llms.txt"], /prod\.auvp|Yoast/);
});
