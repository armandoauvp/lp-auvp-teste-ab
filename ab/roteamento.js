/**
 * Quem vê qual versão de uma página em teste A/B. Ver docs/AB-TESTING.md.
 *
 * Função pura, sem nada da Vercel nem do Node: o `middleware.js` da raiz (que
 * roda na Vercel) e o `scripts/preview.mjs` (servidor local) chamam a mesma
 * `decidir()`, e os testes em `ab/roteamento.test.js` também.
 */

/** Sem `cookieDays` no teste, a pessoa fica na mesma versão por 30 dias. */
export const DIAS_PADRAO = 30;

export const nomeDoCookie = (id) => `ab_${id}`;

/** Lê um cabeçalho `Cookie` (`a=1; b=2`) para um objeto. */
export function lerCookies(cabecalho) {
  const cookies = {};
  for (const par of (cabecalho ?? "").split(";")) {
    const i = par.indexOf("=");
    if (i < 0) continue;
    const nome = par.slice(0, i).trim();
    if (nome && !(nome in cookies)) cookies[nome] = par.slice(i + 1).trim();
  }
  return cookies;
}

/**
 * @param {object} p
 * @param {string} p.pathname caminho pedido, por exemplo `/escola/`
 * @param {string} [p.search] query string, com ou sem `?`
 * @param {string | null} [p.cookies] cabeçalho `Cookie` da requisição
 * @param {{ tests: Array<{ id: string, page: string, split: { a: number, b: number }, cookieDays?: number }> }} p.experimentos
 *   conteúdo do experiments.json
 * @param {boolean} [p.seguro] se a conexão é HTTPS (o cookie sai com `Secure`)
 * @param {() => number} [p.sorteio] número em [0, 1). Trocável nos testes.
 *
 * @returns {{ acao: "seguir" }
 *   | { acao: "redirecionar", destino: string }
 *   | { acao: "servir", versao: "a" | "b", arquivo: string, cookie?: string }}
 *
 * - `seguir`: a página não está em teste; serve normalmente.
 * - `redirecionar`: pediram o `b.html` direto; manda para a página.
 * - `servir`: serve `arquivo` mantendo a URL do navegador. Com `cookie`, grava
 *   a versão sorteada (é a primeira visita).
 */
export function decidir({
  pathname,
  search = "",
  cookies = null,
  experimentos,
  seguro = true,
  sorteio = Math.random,
}) {
  // A B só existe na URL da página: `/x/b.html` volta para `/x/`.
  if (pathname.endsWith("/b.html")) {
    return {
      acao: "redirecionar",
      destino: pathname.slice(0, -"b.html".length) + normalizarBusca(search),
    };
  }

  const teste = experimentos.tests.find((t) => t.page === pathname);
  if (!teste) return { acao: "seguir" };

  const arquivo = (versao) =>
    `${teste.page}${versao === "b" ? "b" : "index"}.html`;

  // `?ab=a` ou `?ab=b`: prévia de quem trabalha no teste. Sem cookie, sem
  // contar na divisão.
  const previa = new URLSearchParams(search).get("ab");
  if (previa === "a" || previa === "b") {
    return { acao: "servir", versao: previa, arquivo: arquivo(previa) };
  }

  const nome = nomeDoCookie(teste.id);
  const atual = lerCookies(cookies)[nome];
  if (atual === "a" || atual === "b") {
    // Não regrava o cookie: o prazo é o da primeira visita.
    return { acao: "servir", versao: atual, arquivo: arquivo(atual) };
  }

  const versao = sorteio() * 100 < teste.split.a ? "a" : "b";
  const dias = teste.cookieDays ?? DIAS_PADRAO;
  // `Path=/` e sem `HttpOnly`: o GTM e as demais páginas precisam ler o cookie
  // para cruzar a versão com a conversão.
  const cookie = [
    `${nome}=${versao}`,
    "Path=/",
    `Max-Age=${dias * 24 * 60 * 60}`,
    "SameSite=Lax",
    ...(seguro ? ["Secure"] : []),
  ].join("; ");
  return { acao: "servir", versao, arquivo: arquivo(versao), cookie };
}

function normalizarBusca(search) {
  if (!search || search === "?") return "";
  return search.startsWith("?") ? search : `?${search}`;
}
