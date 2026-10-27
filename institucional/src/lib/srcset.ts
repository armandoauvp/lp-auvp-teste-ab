import { variantes } from "@/content/variantes";

import { asset } from "./asset";

/**
 * `srcset` de uma foto de public/images/, com as versões menores geradas por
 * scripts/variantes.mjs e o original como a maior. Foto sem variantes (ou de
 * fora de /images/) devolve `undefined`, e o `<img>` fica só com o `src`.
 */
export function srcset(src: string): string | undefined {
  const info = variantes[src];
  if (!info || info.menores.length === 0) return undefined;
  const base = src
    .replace(/^\/images\//, "/images/variantes/")
    .replace(/\.webp$/, "");
  return [
    ...info.menores.map(
      (largura) => `${asset(`${base}-${largura}.webp`)} ${largura}w`,
    ),
    `${asset(src)} ${info.original}w`,
  ].join(", ");
}
