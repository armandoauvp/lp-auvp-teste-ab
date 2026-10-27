/**
 * Divisão dos testes A/B na Vercel (Routing Middleware). Roda antes de a
 * Vercel servir cada página e decide, com `ab/roteamento.js`, qual arquivo
 * entregar. A URL do navegador não muda: quem cai na B continua vendo
 * `/escola/`, não `/escola/b.html`.
 *
 * Os testes ligados vêm do experiments.json, lido no deploy. Mudar um teste é
 * mudar o JSON e publicar; este arquivo não precisa ser editado.
 *
 * Só a Vercel executa isto. No GitHub Pages, que serve arquivo estático puro,
 * todo mundo vê a versão A. Ver docs/AB-TESTING.md.
 */
import { decidir } from "./ab/roteamento.js";
import experimentos from "./experiments.json" with { type: "json" };

/*
 * Páginas, não arquivos: o middleware fica fora de CSS, JS, imagens, fontes e
 * vídeos. Precisa ser texto fixo (a Vercel lê no build), por isso não sai do
 * experiments.json. `.html` continua de fora da exclusão para o redirecionamento
 * de `b.html` funcionar.
 */
export const config = {
  // Node.js, não Edge: o Edge não carrega um .json importado, e foi isso que
  // derrubou o site na primeira versão (MIDDLEWARE_INVOCATION_FAILED).
  runtime: "nodejs",
  matcher:
    "/((?!.*\\.(?:css|js|mjs|map|json|txt|xml|webmanifest|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|pdf)$).*)",
};

export default function middleware(request) {
  try {
    return dividir(request);
  } catch (erro) {
    // Um erro aqui não pode derrubar a página: serve a A e registra.
    console.error("teste A/B: erro no middleware", erro);
    return seguir();
  }
}

function dividir(request) {
  const url = new URL(request.url);
  const decisao = decidir({
    pathname: url.pathname,
    search: url.search,
    cookies: request.headers.get("cookie"),
    experimentos,
    seguro: url.protocol === "https:",
  });

  if (decisao.acao === "redirecionar") {
    return Response.redirect(new URL(decisao.destino, url), 307);
  }
  if (decisao.acao === "seguir") return seguir();

  const headers = new Headers();
  if (decisao.cookie) headers.append("set-cookie", decisao.cookie);
  // A A é o próprio index.html da pasta: basta seguir. A B é servida no lugar
  // dele, sem redirecionar.
  return decisao.versao === "b"
    ? servirNoLugar(new URL(decisao.arquivo, url), headers)
    : seguir(headers);
}

/*
 * Respostas que a Vercel entende como "siga" e "sirva este outro arquivo".
 * São o que `next()` e `rewrite()` do pacote `@vercel/functions/middleware`
 * devolvem; ficam aqui para não trazer o pacote e as dependências dele só por
 * dois cabeçalhos.
 */
function seguir(headers = new Headers()) {
  headers.set("x-middleware-next", "1");
  return new Response(null, { headers });
}

function servirNoLugar(destino, headers = new Headers()) {
  headers.set("x-middleware-rewrite", String(destino));
  return new Response(null, { headers });
}
