import { ArrowRight } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { GroupLabel } from "@/components/ui/GroupLabel";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { initiatives, partnerships, products } from "@/content/initiatives";

/**
 * Aviso de iniciativa sem página ainda, no lugar onde estaria o "Saiba mais".
 *
 * O balão só existe onde há ponteiro que paira. Em tela de toque não há hover,
 * e um aviso que nunca aparece é um aviso que não existe: por isso o padrão é o
 * texto visível, e a variante `@media (hover: hover)` é que o esconde para
 * revelar no hover. Assim quem usa dedo lê "Em breve" direto, e quem usa mouse
 * ganha o balão.
 *
 * O rótulo continua no fluxo do documento nos dois casos, então leitor de tela
 * lê "AUVP Experience ... Em breve" sem depender de nada disso. Não é link nem
 * botão de propósito: não há para onde ir, e um controle que não faz nada é
 * pior do que um aviso.
 */
function ComingSoon() {
  return (
    <span className="group eyebrow text-ink/45 relative mt-2 inline-flex w-fit items-center gap-2">
      Saiba mais
      <ArrowRight className="h-3 w-3" />
      {/* O balão sai pela direita, e não por cima: acima do "Saiba mais" está
          a última linha da descrição, e um balão ali cobriria o texto que a
          pessoa acabou de ler. À direita há a coluna vazia. */}
      <span className="border-ink/15 bg-paper-soft text-ink/70 rounded-full border px-3 py-1 whitespace-nowrap [@media(hover:hover)]:absolute [@media(hover:hover)]:top-1/2 [@media(hover:hover)]:left-[calc(100%+0.75rem)] [@media(hover:hover)]:-translate-x-1 [@media(hover:hover)]:-translate-y-1/2 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition [@media(hover:hover)]:duration-300 [@media(hover:hover)]:group-hover:translate-x-0 [@media(hover:hover)]:group-hover:opacity-100">
        Em breve
      </span>
    </span>
  );
}

/**
 * Dobra 08. Produtos em grade densa; parcerias em faixas horizontais que
 * alternam o lado da fotografia a cada bloco.
 */
export function Initiatives() {
  return (
    <Section id="iniciativas" tone="paper" rule>
      <Container>
        <SectionHeading
          title={initiatives.title}
          subtitle={initiatives.subtitle}
        />

        <div className="mt-14">
          <GroupLabel className="mb-6">{initiatives.productsLabel}</GroupLabel>
          <ul className="border-paper-line bg-paper-line grid gap-px border sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => {
              // Produto sem endereço confirmado vira `div`, e não `a` sem
              // `href`: âncora sem destino continua no caminho do Tab e não
              // leva a lugar nenhum. Ver o tipo `Product`.
              const Casca = product.href ? "a" : "div";
              return (
                <Reveal
                  key={product.name}
                  as="li"
                  delay={(index % 4) * 70}
                  className="bg-paper"
                >
                  <Casca
                    {...(product.href
                      ? {
                          href: product.href,
                          target: "_blank",
                          rel: "noopener noreferrer",
                        }
                      : {})}
                    className={`group flex h-full flex-col gap-3 p-7 transition-colors duration-500 ${
                      product.href ? "hover:bg-paper-soft" : ""
                    }`}
                  >
                    <h3 className="text-ink font-[family-name:var(--font-display)] text-2xl leading-tight font-medium">
                      {product.name}
                    </h3>
                    <p className="text-graphite flex-1 text-sm leading-relaxed">
                      {product.description}
                    </p>
                    {product.href ? (
                      <span className="eyebrow text-ink mt-2 flex items-center gap-2 transition-transform duration-500 group-hover:translate-x-1">
                        Saiba mais
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    ) : null}
                  </Casca>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <div className="mt-20">
          <GroupLabel className="mb-10">
            {initiatives.partnershipsLabel}
          </GroupLabel>
          <div className="divide-paper-line border-paper-line flex flex-col divide-y border-y">
            {partnerships.map((partnership, index) => {
              const reversed = index % 2 === 1;
              return (
                <Reveal
                  key={partnership.name}
                  as="article"
                  className="grid items-center gap-10 py-12 md:py-14 lg:grid-cols-2 lg:gap-16"
                >
                  <Figure
                    src={partnership.photo.src}
                    alt={partnership.photo.alt}
                    caption={partnership.photo.caption}
                    brief={partnership.photo.brief}
                    ratio="4/3"
                    className={reversed ? "lg:order-2" : undefined}
                  />

                  <div className="flex flex-col gap-4">
                    <h3 className="text-ink font-[family-name:var(--font-display)] text-3xl leading-tight font-medium md:text-4xl">
                      {partnership.name}
                    </h3>
                    <p className="text-graphite max-w-[54ch] text-base leading-[1.75]">
                      {partnership.description}
                    </p>
                    {partnership.href ? (
                      <a
                        href={partnership.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Saiba mais sobre ${partnership.name}`}
                        className="eyebrow text-ink/70 hover:text-ink mt-2 inline-flex w-fit items-center gap-2 transition-colors duration-300"
                      >
                        Saiba mais
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    ) : null}

                    {partnership.comingSoon ? <ComingSoon /> : null}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
