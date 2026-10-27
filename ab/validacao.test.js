import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { canonical, validarExperimentos, validarSite } from "./validacao.js";

const ok = { id: "escola-titulo", page: "/escola/", split: { a: 50, b: 50 } };
const erros = (...tests) => validarExperimentos({ tests });

test("experiments.json válido passa", () => {
  assert.deepEqual(validarExperimentos({ tests: [] }), []);
  assert.deepEqual(
    erros(ok, { ...ok, id: "home", page: "/", cookieDays: 365 }),
    [],
  );
});

test("forma errada do arquivo", () => {
  assert.equal(validarExperimentos([]).length, 1);
  assert.equal(validarExperimentos({ testes: [] }).length, 1);
});

test("id, page, split e cookieDays fora da regra", () => {
  assert.match(erros({ ...ok, id: "Escola_Titulo" })[0], /"id"/);
  assert.match(erros({ ...ok, page: "/escola" })[0], /"page"/);
  assert.match(erros({ ...ok, page: "escola/" })[0], /"page"/);
  assert.match(erros({ ...ok, page: "/../" })[0], /"page"/);
  assert.match(erros({ ...ok, split: { a: 60, b: 50 } })[0], /soma 110/);
  assert.match(erros({ ...ok, split: { a: 50 } })[0], /"split"/);
  assert.match(erros({ ...ok, split: { a: 49.5, b: 50.5 } })[0], /"split"/);
  assert.match(erros({ ...ok, cookieDays: 0 })[0], /cookieDays/);
  assert.match(erros({ ...ok, cookieDays: 366 })[0], /cookieDays/);
  assert.match(erros({ ...ok, cookiedays: 14 })[0], /desconhecido/);
});

test("um teste por página e ids únicos", () => {
  assert.match(erros(ok, { ...ok, id: "outro" })[0], /um teste por página/);
  assert.match(erros(ok, { ...ok, page: "/outra/" })[0], /já é usado/);
});

test("canonical é lido do <link>", () => {
  assert.equal(
    canonical('<head><link href="https://x/" rel="canonical" /></head>'),
    "https://x/",
  );
  assert.equal(canonical('<link rel="icon" href="a.png">'), null);
});

async function site(arquivos) {
  const dist = await mkdtemp(path.join(tmpdir(), "ab-"));
  for (const [nome, html] of Object.entries(arquivos)) {
    await mkdir(path.dirname(path.join(dist, nome)), { recursive: true });
    await writeFile(path.join(dist, nome), html);
  }
  return dist;
}
const canon = (href) => `<head><link rel="canonical" href="${href}"></head>`;

test("site com as duas versões e o mesmo canonical passa", async (t) => {
  const dist = await site({
    "escola/index.html": canon("https://x/escola/"),
    "escola/b.html": canon("https://x/escola/"),
    "outra/index.html": "<head></head>",
  });
  t.after(() => rm(dist, { recursive: true }));
  assert.deepEqual(await validarSite(dist, { tests: [ok] }), []);
});

test("teste sem b.html, b.html sem teste e canonical diferente", async (t) => {
  const dist = await site({
    "escola/index.html": canon("https://x/escola/"),
    "seguros/index.html": canon("https://x/seguros/"),
    "seguros/b.html": canon("https://x/seguros/b"),
    "quem-somos/index.html": "<head></head>",
    "quem-somos/b.html": "<head></head>",
    "b.html": "<head></head>",
  });
  t.after(() => rm(dist, { recursive: true }));
  const lista = await validarSite(dist, {
    tests: [ok, { id: "seguros", page: "/seguros/", split: { a: 50, b: 50 } }],
  });
  assert.equal(lista.length, 4, lista.join("\n"));
  assert.ok(
    lista.some((e) => /falta a versão B \(\/escola\/b\.html\)/.test(e)),
  );
  assert.ok(lista.some((e) => /"seguros".*canonical/.test(e)));
  assert.ok(lista.some((e) => e.startsWith("/quem-somos/b.html existe")));
  assert.ok(lista.some((e) => e.startsWith("/b.html existe")));
});
