/**
 * Gera as versões menores das fotos para `srcset`.
 *
 *     npm run imagens -w institucional
 *
 * Para cada .webp em `public/images/` (sem subpastas), grava em
 * `public/images/variantes/` uma cópia com 640, 1024 e 1600 px de largura,
 * só das larguras menores que a original, e escreve `src/content/variantes.ts`
 * com as larguras de cada foto. `Figure`, o hero e a dobra de encerramento
 * leem esse arquivo para montar o `srcset`; foto sem entrada nele continua
 * saindo só com o `src` original.
 *
 * Rode depois de acrescentar ou trocar uma foto, e faça commit do resultado.
 * O celular deixa de baixar o arquivo de 2000 px para mostrar 400 px de
 * largura (PageSpeed, outubro de 2026). Ver docs/ASSETS.md.
 */
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { format, resolveConfig } from "prettier";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const pasta = path.join(root, "public/images");
const destino = path.join(pasta, "variantes");
const LARGURAS = [640, 1024, 1600];

await rm(destino, { recursive: true, force: true });
await mkdir(destino, { recursive: true });

const mapa = {};
const arquivos = (await readdir(pasta, { withFileTypes: true }))
  .filter((d) => d.isFile() && d.name.endsWith(".webp"))
  .map((d) => d.name)
  .sort();

for (const nome of arquivos) {
  const original = path.join(pasta, nome);
  const { width } = await sharp(original).metadata();
  const menores = LARGURAS.filter((l) => l < width);
  const base = nome.replace(/\.webp$/, "");
  for (const largura of menores) {
    await sharp(original)
      .resize({ width: largura })
      .webp({ quality: 78 })
      .toFile(path.join(destino, `${base}-${largura}.webp`));
  }
  mapa[`/images/${nome}`] = { original: width, menores };
  console.log(`${nome}: ${width}px → ${menores.join(", ") || "sem variantes"}`);
}

const linhas = Object.entries(mapa)
  .map(
    ([src, { original, menores }]) =>
      `  "${src}": { original: ${original}, menores: [${menores.join(", ")}] },`,
  )
  .join("\n");

const arquivoTs = path.join(root, "src/content/variantes.ts");
const fonte = `/**
 * Larguras das fotos de public/images/, para o srcset. Gerado por
 * scripts/variantes.mjs (npm run imagens -w institucional): não edite à mão.
 */
export const variantes: Record<
  string,
  { original: number; menores: readonly number[] }
> = {
${linhas}
};
`;
// Sai já no formato do Prettier, para o format:check do CI passar.
await writeFile(
  arquivoTs,
  await format(fonte, {
    ...(await resolveConfig(arquivoTs)),
    filepath: arquivoTs,
  }),
);
