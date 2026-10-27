/**
 * Confere o experiments.json e o site montado antes de publicar. Roda no fim
 * do `npm run build`; se algo estiver errado, o build falha com a lista do que
 * corrigir, e o PR não passa. Ver docs/AB-TESTING.md.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Começa e termina com `/`; sem `.` ou `..` como segmento.
const PAGINA = /^\/(?:(?!\.\.?\/)[A-Za-z0-9._~-]+\/)*$/;
const CAMPOS = new Set(["id", "page", "split", "cookieDays"]);

/** Erros de formato do experiments.json. Lista vazia: tudo certo. */
export function validarExperimentos(dados) {
  const erros = [];
  if (!dados || typeof dados !== "object" || !Array.isArray(dados.tests)) {
    return ['experiments.json precisa ter a forma { "tests": [ ... ] }.'];
  }

  const ids = new Map();
  const paginas = new Map();
  dados.tests.forEach((teste, i) => {
    const onde = `teste ${i + 1}${typeof teste?.id === "string" ? ` ("${teste.id}")` : ""}`;
    if (!teste || typeof teste !== "object" || Array.isArray(teste)) {
      erros.push(`${onde}: precisa ser um objeto { "id", "page", "split" }.`);
      return;
    }

    for (const campo of Object.keys(teste)) {
      if (!CAMPOS.has(campo)) {
        erros.push(
          `${onde}: campo "${campo}" desconhecido. Os campos são id, page, split e cookieDays.`,
        );
      }
    }

    if (typeof teste.id !== "string" || !ID.test(teste.id)) {
      erros.push(
        `${onde}: "id" precisa ter só letras minúsculas, números e hífen (ex.: "escola-titulo").`,
      );
    } else if (ids.has(teste.id)) {
      erros.push(
        `${onde}: o id "${teste.id}" já é usado pelo teste ${ids.get(teste.id)}.`,
      );
    } else {
      ids.set(teste.id, i + 1);
    }

    if (typeof teste.page !== "string" || !PAGINA.test(teste.page)) {
      erros.push(
        `${onde}: "page" precisa começar e terminar com "/" (ex.: "/escola/", ou "/" para a página inicial).`,
      );
    } else if (paginas.has(teste.page)) {
      erros.push(
        `${onde}: a página ${teste.page} já está no teste ${paginas.get(teste.page)}. É um teste por página.`,
      );
    } else {
      paginas.set(teste.page, i + 1);
    }

    const { split } = teste;
    const pct = (v) => Number.isInteger(v) && v >= 0 && v <= 100;
    if (
      !split ||
      typeof split !== "object" ||
      Object.keys(split).some((k) => k !== "a" && k !== "b") ||
      !pct(split.a) ||
      !pct(split.b)
    ) {
      erros.push(
        `${onde}: "split" precisa ser { "a": <0 a 100>, "b": <0 a 100> }, em números inteiros.`,
      );
    } else if (split.a + split.b !== 100) {
      erros.push(
        `${onde}: a divisão soma ${split.a + split.b}; "a" + "b" precisam somar 100.`,
      );
    }

    if (
      "cookieDays" in teste &&
      !(
        Number.isInteger(teste.cookieDays) &&
        teste.cookieDays >= 1 &&
        teste.cookieDays <= 365
      )
    ) {
      erros.push(
        `${onde}: "cookieDays" precisa ser um número inteiro de 1 a 365 (ou ficar de fora: são 30).`,
      );
    }
  });
  return erros;
}

/**
 * Erros do site montado: cada teste com `index.html` e `b.html` na pasta da
 * página, nenhum `b.html` sem teste e o mesmo `<link rel="canonical">` nas
 * duas versões.
 *
 * @param {string} dist pasta do site montado
 * @param {{ tests: Array<{ id: string, page: string }> }} dados experiments.json já validado
 */
export async function validarSite(dist, dados) {
  const erros = [];
  const existe = (arquivo) =>
    stat(arquivo).then(
      (info) => info.isFile(),
      () => false,
    );

  for (const teste of dados.tests) {
    const a = path.join(dist, teste.page, "index.html");
    const b = path.join(dist, teste.page, "b.html");
    const temA = await existe(a);
    const temB = await existe(b);
    if (!temA) {
      erros.push(
        `teste "${teste.id}": a página ${teste.page} não existe no site (falta ${teste.page}index.html).`,
      );
    }
    if (!temB) {
      erros.push(
        `teste "${teste.id}": falta a versão B (${teste.page}b.html). Crie o b.html ou apague o teste do experiments.json.`,
      );
    }
    if (temA && temB) {
      const canonA = canonical(await readFile(a, "utf8"));
      const canonB = canonical(await readFile(b, "utf8"));
      if (canonA !== canonB) {
        erros.push(
          `teste "${teste.id}": o <link rel="canonical"> do b.html (${canonB ?? "nenhum"}) precisa ser igual ao do index.html (${canonA ?? "nenhum"}).`,
        );
      }
    }
  }

  const paginasEmTeste = new Set(dados.tests.map((t) => t.page));
  const arquivos = await readdir(dist, { recursive: true });
  for (const arquivo of arquivos) {
    const partes = arquivo.split(path.sep);
    if (partes.at(-1) !== "b.html") continue;
    const pagina = `/${partes
      .slice(0, -1)
      .map((p) => `${p}/`)
      .join("")}`;
    if (!paginasEmTeste.has(pagina)) {
      erros.push(
        `${pagina}b.html existe, mas não há teste para ${pagina} no experiments.json. Acrescente o teste ou apague o b.html.`,
      );
    }
  }
  return erros;
}

/** href do primeiro `<link rel="canonical">`, ou null se não houver. */
export function canonical(html) {
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    if (/\brel\s*=\s*["']?canonical["'\s>/]/i.test(tag)) {
      return tag.match(/\bhref\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
    }
  }
  return null;
}
