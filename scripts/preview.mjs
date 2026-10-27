/**
 * Serve `dist/` localmente para conferir o build antes do deploy.
 *
 *     npm run build && npm run preview     # http://localhost:4173
 *     npm run preview -- outra/pasta         # serve outra pasta no lugar de dist/
 *
 * Serve na raiz, então o build precisa ter sido feito sem `SITE_BASE_PATH`.
 * Imita o que Pages e Vercel fazem: `/pasta/` responde com `pasta/index.html`.
 * Imita também a divisão dos testes A/B que o `middleware.js` faz na Vercel,
 * com o experiments.json da raiz: cookie `ab_<id>`, `?ab=a|b` e o
 * redirecionamento de `b.html`. Para cair de novo no sorteio, apague o cookie.
 */
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { decidir } from "../ab/roteamento.js";

const dist = path.resolve(
  process.argv[2] ?? path.join(import.meta.dirname, "../dist"),
);
const port = Number(process.env.PORT) || 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

async function resolveFile(urlPath) {
  const file = path.join(dist, decodeURIComponent(urlPath));
  if (!file.startsWith(dist)) return null;
  const info = await stat(file).catch(() => null);
  if (info?.isFile()) return file;
  if (info?.isDirectory()) return resolveFile(path.join(urlPath, "index.html"));
  return null;
}

const experimentos = JSON.parse(
  await readFile(path.join(import.meta.dirname, "../experiments.json"), "utf8"),
);

createServer(async (req, res) => {
  const { pathname, search } = new URL(req.url, "http://localhost");
  const decisao = decidir({
    pathname,
    search,
    cookies: req.headers.cookie,
    experimentos,
    seguro: false,
  });
  if (decisao.acao === "redirecionar") {
    res.writeHead(307, { Location: decisao.destino }).end();
    return;
  }
  // Pasta sem barra final: redireciona, como os hosts fazem.
  const info = await stat(path.join(dist, decodeURIComponent(pathname))).catch(
    () => null,
  );
  if (info?.isDirectory() && !pathname.endsWith("/")) {
    res.writeHead(301, { Location: `${pathname}/` }).end();
    return;
  }
  const file = await resolveFile(
    decisao.acao === "servir" ? decisao.arquivo : pathname,
  );
  if (!file) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("404");
    return;
  }
  res.writeHead(200, {
    ...(decisao.cookie && { "Set-Cookie": decisao.cookie }),
    "Content-Type":
      types[path.extname(file).toLowerCase()] ?? "application/octet-stream",
  });
  createReadStream(file).pipe(res);
}).listen(port, () => console.log(`dist/ em http://localhost:${port}`));
