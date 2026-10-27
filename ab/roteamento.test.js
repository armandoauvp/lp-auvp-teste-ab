import assert from "node:assert/strict";
import test from "node:test";

import { decidir, lerCookies } from "./roteamento.js";

const experimentos = {
  tests: [
    { id: "escola-titulo", page: "/escola/", split: { a: 50, b: 50 } },
    { id: "home", page: "/", split: { a: 20, b: 80 }, cookieDays: 7 },
  ],
};
const pedir = (pathname, extra = {}) =>
  decidir({ pathname, experimentos, ...extra });

test("página fora de teste segue normal", () => {
  assert.deepEqual(pedir("/quem-somos/"), { acao: "seguir" });
  assert.deepEqual(pedir("/escola/index.html"), { acao: "seguir" });
});

test("primeira visita sorteia conforme o split e grava o cookie", () => {
  const a = pedir("/escola/", { sorteio: () => 0.49 });
  assert.equal(a.versao, "a");
  assert.equal(a.arquivo, "/escola/index.html");
  assert.equal(
    a.cookie,
    "ab_escola-titulo=a; Path=/; Max-Age=2592000; SameSite=Lax; Secure",
  );

  const b = pedir("/escola/", { sorteio: () => 0.5 });
  assert.equal(b.versao, "b");
  assert.equal(b.arquivo, "/escola/b.html");
});

test("cookieDays muda o prazo; sem HTTPS o cookie sai sem Secure", () => {
  const d = pedir("/", { sorteio: () => 0.1, seguro: false });
  assert.equal(d.versao, "a");
  assert.equal(d.arquivo, "/index.html");
  assert.equal(d.cookie, "ab_home=a; Path=/; Max-Age=604800; SameSite=Lax");
  assert.equal(pedir("/", { sorteio: () => 0.2 }).versao, "b");
});

test("quem já tem cookie continua na mesma versão, sem regravar", () => {
  const d = pedir("/escola/", {
    cookies: "outro=1; ab_escola-titulo=b",
    sorteio: () => 0,
  });
  assert.deepEqual(d, {
    acao: "servir",
    versao: "b",
    arquivo: "/escola/b.html",
  });
});

test("cookie com valor estranho cai num sorteio novo", () => {
  const d = pedir("/escola/", {
    cookies: "ab_escola-titulo=c",
    sorteio: () => 0.9,
  });
  assert.equal(d.versao, "b");
  assert.ok(d.cookie);
});

test("?ab=a e ?ab=b mostram a versão sem cookie, por cima do cookie", () => {
  const d = pedir("/escola/", {
    search: "?utm_source=x&ab=b",
    cookies: "ab_escola-titulo=a",
  });
  assert.deepEqual(d, {
    acao: "servir",
    versao: "b",
    arquivo: "/escola/b.html",
  });
  assert.equal(pedir("/escola/", { search: "?ab=a" }).cookie, undefined);
  // Valor desconhecido é ignorado: vale o sorteio.
  assert.ok(pedir("/escola/", { search: "?ab=c" }).cookie);
});

test("b.html direto redireciona para a página, mantendo a query", () => {
  assert.deepEqual(pedir("/escola/b.html"), {
    acao: "redirecionar",
    destino: "/escola/",
  });
  assert.deepEqual(pedir("/b.html", { search: "?ab=b" }), {
    acao: "redirecionar",
    destino: "/?ab=b",
  });
});

test("lerCookies separa nome e valor", () => {
  assert.deepEqual(lerCookies("a=1; b = 2;c=x=y"), {
    a: "1",
    b: "2",
    c: "x=y",
  });
  assert.deepEqual(lerCookies(null), {});
});
