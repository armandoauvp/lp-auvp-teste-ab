// Arquivos de SEO da raiz em produção, espelhando os que o Amplify (WordPress/Yoast) servia:
// llms.txt, sitemap_index.xml (e sitemap.xml, igual) e page-sitemap.xml. Aqui com URLs absolutas.

// As mesmas páginas do page-sitemap.xml antigo (conferido em 28/10/2026).
export const PAGINAS = [
  "/",
  "/resolva-aqui/",
  "/politica-de-privacidade/",
  "/obrigado-auvp-analitica/",
  "/quem-somos/",
  "/auvp-internacional/",
  "/termos-de-uso/",
  "/nosso-processo/",
  "/obrigado-aprovado/",
];

const TITULO = "AUVP - A maior escola de investimentos do Brasil";
const XML = '<?xml version="1.0" encoding="UTF-8"?>\n';
const NS = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

export function llmsTxt(siteUrl) {
  return `# AUVP: A maior escola de investimentos do Brasil - Curso Investidor Sardinha - Raul Sena

## Páginas
- [Quem somos](${siteUrl}/quem-somos/)
- [${TITULO}](${siteUrl}/): AUVP é uma escola para investidores, aprenda a investir no Brasil e no mundo em apenas 8 semanas.
- [Termos de uso](${siteUrl}/termos-de-uso/)
- [Política de privacidade](${siteUrl}/politica-de-privacidade/)

## Optional
- [Sitemap index](${siteUrl}/sitemap_index.xml)
`;
}

export function pageSitemap(siteUrl) {
  const urls = PAGINAS.map((p) => `<url><loc>${siteUrl}${p}</loc></url>`);
  return `${XML}<urlset ${NS}>\n${urls.join("\n")}\n</urlset>\n`;
}

export function sitemapIndex(siteUrl) {
  const filhos = ["/page-sitemap.xml", "/institucional/sitemap.xml"];
  const itens = filhos.map(
    (f) => `<sitemap><loc>${siteUrl}${f}</loc></sitemap>`,
  );
  return `${XML}<sitemapindex ${NS}>\n${itens.join("\n")}\n</sitemapindex>\n`;
}

export function robotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap_index.xml\n`;
}

// Nome do arquivo -> conteúdo. Um arquivo já existente na raiz prevalece (flag "wx" na escrita).
export function arquivosSeo(siteUrl) {
  const indice = sitemapIndex(siteUrl);
  return {
    "robots.txt": robotsTxt(siteUrl),
    "llms.txt": llmsTxt(siteUrl),
    "sitemap_index.xml": indice,
    "sitemap.xml": indice,
    "page-sitemap.xml": pageSitemap(siteUrl),
  };
}
