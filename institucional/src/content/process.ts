/** Dobra 05: nosso processo, numa linha do tempo de três etapas. */

export type Stage = {
  step: string;
  label: string;
  /** Só a primeira etapa tem título e texto próprios. */
  title?: string;
  description?: string;
  items: { title: string; description: string }[];
};

export const process = {
  title: "Nosso processo.",
  subtitle: "A formação em três etapas, da seleção à autonomia do investidor.",
  ctaLabel: "Faça sua Análise de Perfil",
} as const;

export const stages: Stage[] = [
  {
    step: "1",
    label: "Primeiro passo",
    title: "Tudo começa por uma análise de perfil",
    description:
      "Antes do início, a AUVP avalia o perfil e a situação financeira de cada candidato, garantindo que a formação seja adequada ao seu momento de vida.",
    items: [],
  },
  {
    step: "2",
    label: "Aprendizagem",
    items: [
      {
        title: "Formação de 8 semanas",
        description:
          "Oito módulos liberados progressivamente, do zero ao avançado.",
      },
      {
        title: "+120 aulas e 8 livros",
        description:
          "Aulas gravadas e livros digitais exclusivos, registrados na Biblioteca Nacional.",
      },
      {
        title: "Atualizações semanais de mercado",
        description: "Ao vivo com Raul Sena.",
      },
    ],
  },
  {
    step: "3",
    label: "Na prática",
    items: [
      {
        title: "Plataforma de investimentos",
        description: "Ambiente exclusivo para o aluno investir.",
      },
      {
        title: "Open Finance",
        description: "Todos os gastos reunidos em um só lugar.",
      },
      {
        title: "Carteiras recomendadas",
        description: "Sugestões de carteira conforme o perfil do investidor.",
      },
      {
        title: "Orçamento doméstico",
        description: "A ferramenta para a sua organização financeira.",
      },
      {
        title: "Diagrama do Cerrado",
        description: "A metodologia para montar a sua carteira.",
      },
      {
        title: "Cartão de crédito AUVP",
        description: "Mastercard Black, com benefícios exclusivos.",
      },
    ],
  },
];
