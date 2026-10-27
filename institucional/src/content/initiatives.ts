/** Dobra 08: as iniciativas da AUVP. */

import { comUtm } from "@/lib/utm";

/**
 * `href` é opcional de propósito. Nenhum endereço aqui é deduzido do nome do
 * produto: ou veio da página da escola em produção, ou veio da instituição.
 * Sem endereço confirmado o cartão não vira link, porque um "Saiba mais" que
 * cai em 404 custa mais do que um cartão que não clica.
 *
 * Todo endereço de produto passa por `comUtm`, para a conversão ser atribuída
 * à LP da escola. Ver `src/lib/utm.ts`.
 */
export type Product = {
  name: string;
  description: string;
  href?: string;
};

/** Mesma regra do `Product`: sem endereço confirmado, sem link. */
export type Partnership = {
  name: string;
  description: string;
  href?: string;
  /**
   * Iniciativa anunciada que ainda não tem página. Em vez de link, o bloco
   * mostra um aviso de "em breve": some quem clica no vazio, e fica registrado
   * que a ausência de endereço é temporária e não um esquecimento.
   */
  comingSoon?: boolean;
  photo: {
    src: string | null;
    alt: string;
    caption: string;
    brief?: string;
  };
};

export const initiatives = {
  title: "As iniciativas da AUVP.",
  subtitle: "Os produtos, serviços e parcerias que formam a instituição.",
  productsLabel: "Produtos",
  partnershipsLabel: "Parceria e presença internacional",
} as const;

export const products: Product[] = [
  {
    name: "AUVP Capital",
    description:
      "Consultoria de investimentos com gestão completa do patrimônio. Top 1 no ranking BTG Pactual.",
    href: comUtm("https://www.auvpcapital.com.br/"),
  },
  {
    name: "AUVP Wealth",
    description:
      "Planejamento patrimonial, sucessório e tributário, com holdings e offshore.",
    href: comUtm("https://auvpcapital.com.br/wealth"),
  },
  {
    name: "AUVP Seguros",
    description:
      "Seguro de vida como estratégia patrimonial, com as melhores seguradoras do mercado.",
    href: comUtm("https://auvpcapital.com.br/seguros/"),
  },
  {
    name: "AUVP Crédito",
    description: "Crédito sob medida com cotação em mais de 20 instituições.",
    href: comUtm("https://auvpcapital.com.br/credito"),
  },
  {
    name: "AUVP Câmbio",
    description: "Câmbio e remessas internacionais, com taxas competitivas.",
    href: comUtm("https://auvpcapital.com.br/cambio"),
  },
  {
    name: "AUVP Corporate",
    description: "Conta PJ, folha de pagamento e automação para a sua empresa.",
    href: comUtm("https://auvpcapital.com.br/corporate/"),
  },
  {
    name: "AUVP Agro",
    description:
      "Educação em seguro de preço e execução de hedge para o agronegócio.",
    href: comUtm("https://auvpagro.com.br/"),
  },
  {
    name: "AUVP Pro",
    description:
      "Preparatórios para as principais certificações do mercado financeiro.",
    href: comUtm("https://auvp.pro/"),
  },
];

export const partnerships: Partnership[] = [
  {
    name: "CEIA",
    description:
      "Parceria com o maior centro de pesquisa em inteligência artificial aplicada do país, na UFG. Juntos, levamos educação financeira aos pesquisadores que constroem a tecnologia do Brasil.",
    /** O centro, na UFG, e não uma página da AUVP sobre ele. */
    href: "https://ceia.ufg.br/",
    photo: {
      src: "/images/ceia-ufg.webp",
      alt: "Pesquisadores do CEIA erguem a bandeira do Brasil diante de um auditório lotado.",
      caption: "CEIA · UFG",
      brief: "dia das palestras no CEIA, paisagem 4:3",
    },
  },
  {
    name: "BTG Pactual",
    description:
      "A AUVP Capital, a consultoria de investimentos da AUVP, opera sobre a infraestrutura do maior banco de investimentos da América Latina, e é reconhecida pelo próprio BTG Pactual como a consultoria nº 1 do país.",
    /**
     * A notícia do prêmio, e não o site da consultoria: numa dobra que afirma
     * um reconhecimento, o link que serve é o que comprova o reconhecimento.
     */
    href: "https://www.terra.com.br/diversao/pelo-segundo-ano-seguido-auvp-conquista-premio-de-consultoria-n-1-do-ranking-btg-pactual,56771109323d0b49558d2db227d734c6214lnnfh.html",
    photo: {
      src: "/images/btg-pactual-time.webp",
      alt: "Time da AUVP Capital reunido no palco, com o gesto de número um.",
      caption: "Reconhecimento BTG Pactual",
      brief: "entrega do prêmio no palco, paisagem 4:3",
    },
  },
  {
    name: "Relações internacionais",
    description:
      "Relações com instituições e embaixadas que abrem novas fronteiras de investimento e de negócios, para a AUVP e para os seus membros. No AUVP Atlas, o canal da AUVP, essas relações viram entrevistas com embaixadores e líderes globais sobre novas oportunidades pelo mundo.",
    /** A publicação da própria embaixada da Rússia sobre a entrevista. */
    href: "https://www.facebook.com/embaixadarussa/posts/1350362523936420/",
    photo: {
      src: "/images/auvp-atlas-embaixador.webp",
      alt: "Entrevista do AUVP Atlas com um embaixador, gravada no estúdio da escola.",
      caption: "AUVP Atlas · Diplomacia",
      brief: "aperto de mãos ou entrevista com embaixador, paisagem 4:3",
    },
  },
  {
    name: "AUVP Experience",
    description:
      "Imersão executiva internacional que leva investidores para dentro dos grandes polos de tecnologia e comércio do mundo.",
    href: comUtm("https://auvpexperience.com.br/"),
    photo: {
      src: "/images/auvp-experience-hong-kong.webp",
      alt: "Delegação da AUVP Experience com a bandeira do Brasil, diante da paisagem de Hong Kong.",
      caption: "AUVP Experience · Ásia",
      brief: "delegação em visita técnica, paisagem 4:3",
    },
  },
];
