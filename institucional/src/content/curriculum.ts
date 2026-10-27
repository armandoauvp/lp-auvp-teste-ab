/**
 * Dobra 04: conteúdo programático.
 *
 * `icon` referencia uma chave de `src/components/ui/ModuleIcon.tsx`. Ao
 * incluir um módulo novo, cadastre o ícone lá antes de referenciá-lo aqui.
 */

export type Module = {
  number: string;
  title: string;
  description: string;
  icon:
    | "mind"
    | "ledger"
    | "bond"
    | "equity"
    | "reserve"
    | "globe"
    | "portfolio"
    | "tax";
};

export const curriculum = {
  title: "Conteúdo programático.",
  subtitle:
    "Sete módulos e um bônus que levam o aluno do primeiro conceito à gestão autônoma da própria carteira.",
} as const;

export const modules: Module[] = [
  {
    number: "01",
    title: "Preparação Mental",
    icon: "mind",
    description:
      "Fundamentos sobre mentalidade financeira, crenças limitantes, disciplina e liberdade de escolha. A base para uma relação saudável e consciente com o dinheiro.",
  },
  {
    number: "02",
    title: "Organização Financeira",
    icon: "ledger",
    description:
      "Estruturação do orçamento doméstico, identificação de gargalos financeiros e análise crítica de financiamentos, consórcios e previdência privada.",
  },
  {
    number: "03",
    title: "Renda Fixa",
    icon: "bond",
    description:
      "Estudo aprofundado dos principais ativos de renda fixa, como Tesouro Direto, CDBs, LCIs, LCAs, CRIs, CRAs, debêntures e fundos de investimento.",
  },
  {
    number: "04",
    title: "Renda Variável",
    icon: "equity",
    description:
      "Análise de ações, fundos imobiliários, ETFs e outros ativos de renda variável. Construção de carteira com foco em dividendos e valorização de longo prazo.",
  },
  {
    number: "05",
    title: "Reservas de Valor",
    icon: "reserve",
    description:
      "Proteção patrimonial com ouro físico, fundos de ouro e Bitcoin. Conceitos de blockchain e formas de custódia de ativos digitais.",
  },
  {
    number: "06",
    title: "Investimentos no Exterior",
    icon: "globe",
    description:
      "Mercado norte-americano, corretoras internacionais, ETFs, REITs e stocks. Estratégias de diversificação cambial e construção de carteira global.",
  },
  {
    number: "07",
    title: "Construção da Carteira",
    icon: "portfolio",
    description:
      "Gestão de carteira, alocação de ativos e aplicação prática do conhecimento adquirido ao longo do treinamento.",
  },
  {
    number: "Bônus",
    title: "Imposto de Renda",
    icon: "tax",
    description:
      "Declaração de investimentos, recolhimento de impostos e conformidade fiscal para investidores.",
  },
];
