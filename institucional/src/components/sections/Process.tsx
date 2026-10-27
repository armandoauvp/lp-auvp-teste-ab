import { useEffect, useRef, useState } from "react";
import { PointerCallout } from "@/components/motion/PointerCallout";
import { ArrowRight, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { process, stages } from "@/content/process";
import { links } from "@/content/site";
import { clamp, prefersReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/cn";

/**
 * Dobra 05: nosso processo, numa linha do tempo vertical.
 *
 * O trilho preenche conforme a rolagem avança, e cada etapa acende ao cruzar a
 * faixa central da tela. A leitura é a mesma de antes, mas o percurso agora tem
 * forma: dá para ver de relance que são três etapas e onde se está nelas.
 *
 * A dobra inteira é a chamada para a Análise de Perfil, com um balão que segue
 * o ponteiro no lugar do botão. Os caminhos alternativos para teclado e toque
 * estão em `PointerCallout`.
 */
export function Process() {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const preenchimentoRef = useRef<HTMLSpanElement>(null);
  const etapasRef = useRef<(HTMLLIElement | null)[]>([]);
  const [ativa, setAtiva] = useState(0);

  // Preenchimento do trilho, escrito direto no style dentro do rAF: rolar não
  // dispara render nenhum.
  useEffect(() => {
    const trilho = trilhoRef.current;
    const preenchimento = preenchimentoRef.current;
    if (!trilho || !preenchimento) return;

    if (prefersReducedMotion()) {
      preenchimento.style.transform = "scaleY(1)";
      return;
    }

    let frame = 0;

    const atualizar = () => {
      frame = 0;
      const r = trilho.getBoundingClientRect();
      const meio = window.innerHeight * 0.55;
      preenchimento.style.transform = `scaleY(${clamp((meio - r.top) / r.height, 0, 1)})`;
    };

    const aoRolar = () => {
      if (frame) return;
      frame = requestAnimationFrame(atualizar);
    };

    atualizar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  // Etapa em leitura, para acender o nó correspondente.
  useEffect(() => {
    const nodes = etapasRef.current.filter(Boolean) as HTMLLIElement[];
    if (nodes.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const visiveis = new Set<number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = nodes.indexOf(entry.target as HTMLLIElement);
          if (i < 0) continue;
          if (entry.isIntersecting) visiveis.add(i);
          else visiveis.delete(i);
        }
        if (visiveis.size > 0) setAtiva(Math.min(...visiveis));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="processo" tone="ink" rule>
      <PointerCallout href={links.profileAnalysis} label={process.ctaLabel}>
        <Container>
          <SectionHeading
            title={process.title}
            subtitle={process.subtitle}
            align="center"
            tone="dark"
          />

          <div ref={trilhoRef} className="relative mt-16 lg:mt-20">
            {/* Trilho. Fica atrás dos nós e some do leitor de tela: a ordem
                da lista já diz que são três etapas em sequência. */}
            <span
              aria-hidden
              className="bg-ink-line absolute top-2 bottom-2 left-[0.9375rem] w-px md:left-[1.4375rem]"
            />
            {/* O preenchimento é um elemento só, com altura vinda de
                top/bottom, e o estado inicial vem de `style` em vez da
                utilitária `scale-y-0`: no Tailwind v4 as utilitárias de escala
                escrevem na propriedade `scale`, independente de `transform` e
                multiplicada com ela, o que zerava o trilho. */}
            <span
              ref={preenchimentoRef}
              aria-hidden
              className="bg-yellow absolute top-2 bottom-2 left-[0.9375rem] w-px origin-top transition-transform duration-150 ease-out md:left-[1.4375rem]"
              style={{ transform: "scaleY(0)" }}
            />

            <ol className="flex flex-col gap-14 md:gap-20">
              {stages.map((stage, index) => {
                const acesa = index <= ativa;
                return (
                  <li
                    key={stage.step}
                    ref={(node) => {
                      etapasRef.current[index] = node;
                    }}
                    className="relative grid grid-cols-[2rem_1fr] items-start gap-5 md:grid-cols-[3rem_1fr] md:gap-8"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "bg-ink relative z-10 flex h-8 w-8 items-center justify-center rounded-full border font-[family-name:var(--font-display)] text-base font-semibold transition-colors duration-500 md:h-12 md:w-12 md:text-xl",
                        acesa
                          ? "border-yellow bg-yellow text-ink"
                          : "border-ink-line text-mist",
                      )}
                    >
                      {stage.step}
                    </span>

                    <div className="flex flex-col gap-5 pt-0.5 md:gap-6 md:pt-2">
                      <p
                        className={cn(
                          "eyebrow transition-colors duration-500",
                          acesa ? "text-yellow" : "text-mist/80",
                        )}
                      >
                        {stage.label}
                      </p>

                      {stage.title ? (
                        <h3 className="text-paper max-w-[22ch] font-[family-name:var(--font-display)] text-3xl leading-tight font-medium md:text-4xl">
                          {stage.title}
                        </h3>
                      ) : null}

                      {stage.description ? (
                        <p className="text-mist max-w-[54ch] text-base leading-relaxed">
                          {stage.description}
                        </p>
                      ) : null}

                      {stage.items.length > 0 ? (
                        <ul className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
                          {stage.items.map((item) => (
                            <li
                              key={item.title}
                              className="bg-ink border-ink-line flex flex-col gap-2 border-t py-5 sm:border-t-0 sm:border-l sm:px-6 sm:py-2 sm:first:border-l-0 sm:first:pl-0 lg:[&:nth-child(4)]:border-l-0 lg:[&:nth-child(4)]:pl-0"
                            >
                              <h4 className="text-paper font-[family-name:var(--font-display)] text-xl leading-snug font-medium">
                                {item.title}
                              </h4>
                              <p className="text-mist text-sm leading-relaxed">
                                {item.description}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* O link de verdade. Some quando existe ponteiro fino, porque lá o
              balão faz o papel dele, e volta ao receber foco de teclado. */}
          <div className="cta-ponteiro-fino mt-16 flex justify-center">
            <Button href={links.profileAnalysis} variant="yellow" size="lg">
              {process.ctaLabel}
              <ArrowRight />
            </Button>
          </div>
        </Container>
      </PointerCallout>
    </Section>
  );
}
