# Arquitetura

Este documento trata da página institucional (`institucional/`). O repositório
também abriga a LP da Escola (`escola/`, HTML + Vite + Tailwind 3) e um índice
(`indice/`), além da página da AUVP Sempre (`auvp-sempre/`, HTML puro, copiada
sem build). Todas saem num único `dist/`; ver [docs/DEPLOY.md](DEPLOY.md).

```
/
├── institucional/      página institucional (Vite + React)
├── escola/             LP da Escola (Vite, HTML puro)
├── indice/             índice publicado na raiz do site
├── scripts/            build.mjs, preview.mjs, esquadro.mjs
├── docs/, acervo/
└── package.json        npm workspaces: um `npm ci` instala tudo
```

As duas páginas têm dependências separadas porque a Escola usa Tailwind 3 e o
institucional usa Tailwind 4, que não convivem na mesma árvore. Os workspaces do
npm resolvem isso com um lock só.

## Stack

| Camada     | Escolha                                  | Por quê                                                          |
| ---------- | ---------------------------------------- | ---------------------------------------------------------------- |
| Build      | Vite 8 + React 19                        | Build rápido, mesma ferramenta da LP da Escola                   |
| Linguagem  | TypeScript (strict)                      | O tipo do conteúdo é o contrato de edição                        |
| Estilo     | Tailwind CSS 4                           | Tokens declarados em `@theme`, sem arquivo de configuração       |
| Fontes     | `@fontsource-variable/inter`             | Auto-hospedadas no build; zero requisição a terceiros em runtime |
| Formatação | Prettier + `prettier-plugin-tailwindcss` | Ordem de classe estável, diff limpo                              |

A página inteira é **estática**. Não há banco, API, formulário ou estado de
servidor: o build gera HTML pronto, **pré-renderizado** a partir dos componentes
React (`scripts/build.mjs` + `src/entry-server.tsx`), e o navegador só hidrata.
Todo destino de conversão é um link para um domínio da AUVP que já existe.

Como o site pode ser servido sob subcaminho (`/<repo>/institucional/` no Pages),
a `base` do Vite vem do ambiente e `src/lib/asset.ts` prefixa os caminhos de
imagem que vivem no conteúdo. Detalhes em [docs/DEPLOY.md](DEPLOY.md).

A página foi escrita em Next.js 16 e migrada para Vite em 2026-10 para unificar a
ferramenta com a LP da Escola. O que era do Next virou: `next/image` → `<img>`
(as fotos já são WebP no tamanho final), `next/link` → `<a>`, `layout.tsx` →
`index.html`, `robots.ts`/`sitemap.ts` → gerados em `scripts/build.mjs`.

## Estrutura

```
institucional/
├── index.html          metadados, Open Graph, fonte Sentient
├── vite.config.ts      base e URL canônica vindas do ambiente
├── scripts/build.mjs   build + pré-renderização + robots/sitemap
└── src/
    ├── App.tsx         composição das dobras, na ordem do roteiro
    ├── main.tsx        hidratação no navegador
    ├── entry-server.tsx  renderização no build
    ├── globals.css     tokens de design e utilitários próprios
    ├── components/
    │   ├── layout/     cabeçalho fixo, rodapé, botão de WhatsApp
    │   ├── motion/     rolagem suave, paralaxe, contagem, revelações
    │   ├── sections/   uma dobra por arquivo
    │   ├── ui/         Container, Section, Button, Figure, Reveal, Eyebrow…
    │   └── StructuredData.tsx
    ├── content/        TODO o texto da página
    └── lib/            utilitários
```

## Os três princípios que sustentam o resto

**1. Conteúdo separado de apresentação.**
`institucional/src/content/` é a fonte única de verdade textual. Marketing edita ali sem
encostar em JSX. O TypeScript valida a forma do dado, então um campo faltando
quebra o build em vez de quebrar a página.

**2. Componente de seção não recebe props.**
Cada dobra importa o próprio conteúdo. Isso torna `App.tsx` uma lista legível da
estrutura da página e elimina a passagem de dados em cadeia.

**3. HTML primeiro, JavaScript para o movimento.**
Todo o conteúdo está no HTML pré-renderizado, então a página é lida, indexada e
navegável antes de qualquer script. O JavaScript hidrata a árvore e liga o que
depende do navegador: estado de rolagem e menu móvel (`SiteHeader`), troca de
categoria no FAQ, `IntersectionObserver` nas revelações, contagem e paralaxe.

Diferença em relação ao Next: lá só os componentes `"use client"` iam ao
navegador. Aqui a árvore inteira vai no bundle (cerca de 80 KB com gzip). Se o
peso virar problema, o caminho é hidratar só as ilhas interativas.

## Decisões que valem explicação

**FAQ em `<details>` nativo.** O acordeão usa `<details name="…">` do HTML. A
resposta está no DOM antes de qualquer hidratação, indexável pelo Google e
acessível pelo teclado sem nenhum handler nosso. O React só decide qual categoria
está visível. O atributo `name` faz o navegador fechar o item anterior sozinho.

**Conteúdo programático em coluna fixa e lista.** A dobra dos módulos era uma
grade de oito cards que só mostrava a descrição no hover. Passou a ser uma
coluna fixa à esquerda com o argumento, e a lista dos oito módulos rolando à
direita, com o numeral do item em leitura preenchendo. A mecânica vem da landing
de recrutamento da AUVP Advisors.

O ganho não é o efeito: é o que ele permitiu abandonar. No hover, sete oitavos
do conteúdo ficavam atrás de um gesto que não existe no celular. Agora os oito
módulos são lidos numa rolagem só.

**Carrossel de apoios sem JavaScript.** A lista é duplicada e o trilho translada
`-50%` em animação linear infinita: laço perfeito, custo zero. A cópia leva
`aria-hidden` para não duplicar a leitura em leitor de tela.

**Reserva de foto pendente.** `Figure` aceita `src: null` e desenha uma moldura
com o briefing da foto que falta. A página fica apresentável durante a produção
do banco de imagens, e o que falta fica visível para todo mundo. Ver
`docs/ASSETS.md`.

**Logo trocado por contraste, não por CSS.** O cabeçalho troca entre o SVG preto
e o branco conforme esteja sobre o hero escuro ou sobre papel. Filtro CSS sobre
SVG degrada o traço fino da serifa.
