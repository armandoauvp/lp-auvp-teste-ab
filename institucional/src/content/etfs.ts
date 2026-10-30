/** Dobra 09: nossos ETFs. */

import { links } from "@/content/site";

export type Etf = {
  ticker: string;
  category: string;
  /**
   * Classe de cor da identidade do fundo, aplicada apenas ao subtitulo (a
   * categoria) dentro da dobra de fundo tinta. O literal precisa ficar
   * escrito por extenso para o Tailwind enxergar a classe na varredura.
   * Ver o bloco de tokens `--color-etf-*` em src/app/globals.css.
   */
  accentClass: string;
  description: string;
  /**
   * O site dos ETFs (`auvpetfs.com.br`), onde a metodologia e a composição
   * de cada fundo ficam abertas. Os quatro cartões apontam para a raiz: o site
   * não tem âncoras por fundo (#auvp11 e afins caíam no topo do mesmo jeito,
   * auditoria de out/2026). Se elas forem criadas lá, volte o `#` aqui.
   */
  href: string;
};

export const etfsSection = {
  title: "Nossos ETFs.",
  subtitle:
    "Fundos de índice construídos com método, não com achismo. Quatro estratégias para acompanhar a evolução da carteira do investidor, cada uma com regras claras e transparentes.",
  ctaLabel: "Conheça todos os ETFs da AUVP",
  photo: {
    src: "/images/b3-listagem-auvp11.webp" as string | null,
    alt: "Raul Sena discursa diante do painel do AUVP11 na cerimônia de listagem.",
    caption: "Cerimônia de listagem na B3",
    brief: "pregão da B3 no dia da listagem, paisagem 4:3",
  },
} as const;

export const etfs: Etf[] = [
  {
    ticker: "AUVP11",
    category: "Ações",
    accentClass: "text-etf-auvp11",
    description:
      "Empresas sólidas, selecionadas por fundamentos consistentes e estrutura de capital saudável.",
    href: links.etfs,
  },
  {
    ticker: "AUPO11",
    category: "Renda Fixa",
    accentClass: "text-etf-aupo11",
    description:
      "Carteira de renda fixa com controle de prazo, critérios objetivos e rebalanceamento periódico.",
    href: links.etfs,
  },
  {
    ticker: "AREA11",
    // Renda fixa, não FII: replica o Teva ITBR IPCA Rendimento, carteira de
    // NTN-B (página do fundo no BTG Pactual, out/2026).
    category: "Renda Fixa · Inflação",
    accentClass: "text-etf-area11",
    description:
      "Títulos do Tesouro atrelados ao IPCA (NTN-B), com foco em distribuição de renda mensal.",
    href: links.etfs,
  },
  {
    ticker: "ABTC11",
    category: "Bitcoin + Renda Fixa",
    accentClass: "text-etf-abtc11",
    description:
      "Combinação dinâmica entre Bitcoin e renda fixa, com alocação baseada no sentimento do mercado.",
    href: links.etfs,
  },
];
