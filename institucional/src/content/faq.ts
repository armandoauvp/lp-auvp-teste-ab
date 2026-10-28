/**
 * Dobra 11: dúvidas frequentes.
 *
 * As perguntas aqui alimentam também o JSON-LD de FAQPage em
 * `src/app/layout.tsx`. Manter respostas em texto puro, sem HTML.
 */

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  items: FaqItem[];
};

export const faq = {
  title: "Dúvidas frequentes",
} as const;

export const faqCategories: FaqCategory[] = [
  {
    id: "basicas",
    label: "Dúvidas básicas",
    items: [
      {
        question: "O que é a AUVP?",
        answer:
          "A AUVP é uma instituição de educação financeira. Começou como uma escola de investimentos e evoluiu para um ecossistema completo, que acompanha o investidor em todas as frentes da vida financeira, da educação à gestão de patrimônio.",
      },
      {
        question:
          "Preciso ser aluno para acessar os outros produtos e serviços da AUVP?",
        answer:
          "A escola é a porta de entrada da AUVP. É a partir dela que o membro passa a ter acesso a todo o ecossistema, dos produtos aos serviços.",
      },
      {
        question: "Quem fundou a AUVP?",
        answer:
          "A AUVP foi fundada em 2020 por Raul Sena, também conhecido pelo canal o Investidor Sardinha. Investidor independente, ele idealizou a instituição para levar educação financeira honesta e de qualidade a qualquer pessoa, e segue à frente do conteúdo e das aulas ao vivo da escola. Hoje, é CEO da AUVP Capital, que além do braço educacional, também foi eleita a melhor consultoria de investimentos pelo segundo ano consecutivo pelo Ranking BTG Pactual.",
      },
    ],
  },
  {
    id: "metodologia",
    label: "Metodologia",
    items: [
      {
        question: "Como funciona a formação?",
        answer:
          "São sete módulos e um bônus, liberados progressivamente ao longo de oito semanas, do zero ao avançado, com mais de 100 aulas gravadas, oito livros digitais exclusivos e atualizações semanais de mercado ao vivo com Raul Sena.",
      },
      {
        question: "O que é o Diagrama do Cerrado?",
        answer:
          "É a metodologia proprietária da AUVP para montagem e rebalanceamento de carteira. Ela traduz o perfil e os objetivos do investidor em critérios objetivos de alocação, sem depender de palpite ou indicação de terceiros.",
      },
      {
        question: "Preciso de conhecimento prévio para começar?",
        answer:
          "Não. A formação começa pela preparação mental e pela organização financeira, antes de qualquer conteúdo sobre produtos de investimento. O aluno avança do zero ao avançado dentro da própria trilha.",
      },
    ],
  },
  {
    id: "valores",
    label: "Valores e garantia",
    items: [
      {
        question: "Qual é a garantia oferecida pela AUVP?",
        answer:
          "Se o aluno concluir o curso, fizer as provas, receber o certificado e ainda não se sentir confiante para investir, a AUVP devolve 100% do valor pago em até 7 dias após a emissão do certificado. A garantia vale durante a vigência da turma: 1 ano a partir da compra.",
      },
      {
        question: "A AUVP recebe comissão por indicar investimentos?",
        answer:
          "O princípio fundador da instituição é que a educação financeira deve vir antes de qualquer decisão de investimento. O conteúdo da escola é independente e ensina o aluno a decidir sozinho, sem depender de recomendação.",
      },
    ],
  },
  {
    id: "como-funciona",
    label: "Como funciona?",
    items: [
      {
        question: "Como faço para estudar na AUVP?",
        answer:
          "O primeiro passo é a Análise de Perfil. A AUVP avalia o perfil e a situação financeira de cada candidato para garantir que a formação seja adequada ao seu momento de vida.",
      },
      {
        question: "Por quanto tempo tenho acesso ao conteúdo?",
        answer:
          "O acesso é válido por 1 ano, contado a partir da aula inaugural, incluindo as atualizações feitas no conteúdo nesse período. Depois disso, o aluno pode continuar pela AUVP Sempre, o plano de renovação.",
      },
      {
        question: "As aulas são gravadas?",
        answer:
          "São mais de 100 aulas gravadas, disponíveis para o aluno ver e rever quantas vezes quiser. Além disso, contamos com encontros semanais para atualizações de mercado e um momento de dúvidas com Raul.",
      },
    ],
  },
];
