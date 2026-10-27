/**
 * Dobra 06: comunidade.
 *
 * `photos` aceita `src: null` enquanto a foto definitiva não existe: o
 * componente `Figure` renderiza uma reserva editorial com o briefing visível.
 * Ver docs/ASSETS.md para a lista de fotos pendentes.
 */

export type CommunityPhoto = {
  src: string | null;
  alt: string;
  caption: string;
  /** Briefing exibido na reserva quando `src` é null. */
  brief?: string;
};

export const community = {
  title: "Aqui você não está sozinho.",
  subtitle:
    "Mais de 60 mil alunos formam uma comunidade que vai muito além dos investimentos: um espaço onde dúvidas são respondidas, decisões são discutidas e conexões se formam no ambiente online e presencial.",
  ctaLabel: "Faça parte de nossa comunidade",
  /**
   * A primeira ocupa a largura toda; as outras quatro vêm em duas linhas de
   * duas colunas. A ordem não é decorativa: em cima o encontro anual, embaixo
   * o Giro da Bolsa Itinerante, uma cidade em cada célula. A dobra afirma que a
   * comunidade é online e presencial, e o itinerante é a metade presencial que
   * não acontece só uma vez por ano nem só em Goiânia.
   *
   * As duas do itinerante vêm de `ProdutosAUVP/gdb-itinerante`, o repositório
   * da landing do evento, que é da AUVP Capital. É a mesma casa e é registro
   * próprio, mas a legenda nomeia o evento em vez de deixar a foto passar por
   * Private Day.
   */
  photos: [
    {
      src: "/images/private-day-salao.webp",
      alt: "Salão lotado durante o Private Day da AUVP, com alunos brindando.",
      caption: "Private Day 2025 · Confraternização",
      brief: "plano aberto do salão cheio, paisagem 3:2",
    },
    {
      src: "/images/private-day-palestras.webp",
      alt: "Convidado do Private Day da AUVP durante a conversa no palco.",
      caption: "Private Day 2025 · Palestras",
      brief: "palco em primeiro plano e plateia cheia ao fundo, paisagem 4:3",
    },
    {
      src: "/images/private-day-networking.webp",
      alt: "Dois participantes do Private Day se cumprimentam no meio da plateia.",
      caption: "Private Day 2025 · Networking",
      brief: "grupo de três a cinco pessoas em conversa, paisagem 4:3",
    },
    {
      src: "/images/gdb-itinerante-belo-horizonte.webp",
      alt: "Plateia acompanha a gravação do Giro da Bolsa Itinerante em Belo Horizonte.",
      caption: "Giro da Bolsa Itinerante · Belo Horizonte",
      brief: "plateia atenta em plano médio, paisagem 4:3",
    },
    {
      src: "/images/gdb-itinerante-goiania.webp",
      alt: "Gravação do Giro da Bolsa Itinerante em Goiânia, com câmera, microfones e os dois convidados à mesa.",
      caption: "Giro da Bolsa Itinerante · Goiânia",
      brief:
        "estúdio montado na cidade, com câmera e microfones à vista, paisagem 4:3",
    },
  ] satisfies CommunityPhoto[],
} as const;
