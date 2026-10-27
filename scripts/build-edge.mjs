// Gera edge/dist/request.js e edge/dist/response.js (as funções do CloudFront)
// a partir de experiments.json e vercel.json. Só o deploy na AWS usa isto.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { buildEdge, redirectsFrom } from "./lib/edge.mjs";

const root = resolve(import.meta.dirname, "..");
const read = (f) => JSON.parse(readFileSync(resolve(root, f), "utf8"));
const out = buildEdge({
  tests: read("experiments.json").tests,
  redirects: redirectsFrom(read("vercel.json")),
});

mkdirSync(resolve(root, "edge/dist"), { recursive: true });
for (const [name, code] of Object.entries(out)) {
  writeFileSync(resolve(root, `edge/dist/${name}.js`), code);
  console.log(`edge/dist/${name}.js (${Buffer.byteLength(code)} bytes)`);
}
