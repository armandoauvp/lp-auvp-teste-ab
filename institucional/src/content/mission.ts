/** Dobra 03: missão. */

export const mission = {
  title: "O Brasil merece educação financeira de verdade.",
  /**
   * Texto enxuto de propósito, e não por acaso: a fotografia ao lado tem a
   * altura desta coluna, então cada linha a mais aqui deixa a moldura mais
   * alta e o recorte da fachada mais fechado. Nenhum fato saiu na redução, só
   * repetição: "em todas as frentes da vida financeira" dizia o mesmo que "da
   * educação à gestão de patrimônio", e "essa trajetória é reforçada por" era
   * rodeio para chegar na AUVP Capital.
   */
  paragraphs: [
    "A maioria dos brasileiros nunca teve acesso a um ensino financeiro honesto. Foi para mudar isso que a AUVP nasceu, fundada por Raul Sena em 2020, com a missão de transformar o Brasil em um país de investidores.",
    "O que começou como uma escola de investimentos virou um ecossistema financeiro completo, da educação à gestão de patrimônio. A AUVP Capital é reconhecida pelo BTG Pactual como a consultoria nº 1 do país por dois anos consecutivos.",
  ],
  photo: {
    src: "/images/sede-auvp-capital.webp" as string | null,
    alt: "Fachada da sede da AUVP, em Goiânia.",
    caption: "Sede, Goiânia, Goiás",
    /**
     * Briefing da foto que substitui esta. A fachada resolve, mas comunica
     * escritório; o interior comunica escola. Ver docs/ASSETS.md.
     */
    brief:
      "interior da sede: biblioteca, auditório ou sala de aula, paisagem 4:3",
  },
} as const;
