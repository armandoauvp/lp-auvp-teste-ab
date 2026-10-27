import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { Section } from "@/components/ui/Section";
import { curriculum, modules } from "@/content/curriculum";
import { cn } from "@/lib/cn";

/**
 * Dobra 04: conteúdo programático.
 *
 * A mecânica vem da dobra "Muito além de uma intermediária" da landing de
 * recrutamento: coluna fixa à esquerda com o argumento da dobra, lista rolando
 * à direita, e o numeral do item que cruza a faixa central da tela preenchendo.
 *
 * O ganho não é o efeito, é o que ele permite abandonar. A versão anterior era
 * uma grade de oito cards que só mostrava a descrição no hover: no celular
 * ficava tudo aberto e desalinhado, e no desktop sete oitavos do conteúdo
 * ficavam escondidos atrás de um gesto. Aqui os oito módulos são lidos numa
 * rolagem só, e o movimento vem da leitura, não de um clique.
 */
export function Curriculum() {
  const [active, setActive] = useState(0);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemsRef.current.filter(Boolean) as HTMLLIElement[];
    if (nodes.length === 0 || typeof IntersectionObserver === "undefined") {
      return;
    }

    const visible = new Set<number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const index = nodes.indexOf(entry.target as HTMLLIElement);
          if (index < 0) continue;
          if (entry.isIntersecting) visible.add(index);
          else visible.delete(index);
        }
        // Se a faixa central ficar vazia entre dois itens, o anterior permanece.
        if (visible.size > 0) setActive(Math.min(...visible));
      },
      // Faixa de cerca de 10% da altura no meio da tela: um ou dois itens por vez.
      { rootMargin: "-45% 0px -45% 0px" },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <Section id="conteudo" tone="paper" rule>
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32">
            <h2 className="font-[family-name:var(--font-display)] text-4xl leading-[1.08] font-medium tracking-[-0.01em] text-balance md:text-5xl">
              {curriculum.title}
            </h2>
            <p className="text-graphite text-balance-pretty mt-5 max-w-[38ch] text-base leading-relaxed md:text-lg">
              {curriculum.subtitle}
            </p>

            {/* Contador do item em leitura. Decorativo para leitor de tela:
                a lista ao lado já é numerada e ordenada. */}
            <p
              aria-hidden
              className="border-paper-line mt-10 hidden items-baseline gap-3 border-t pt-6 lg:flex"
            >
              <span className="text-ink font-[family-name:var(--font-display)] text-4xl leading-none font-semibold tabular-nums">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="eyebrow text-graphite/70">
                de {String(modules.length).padStart(2, "0")}
              </span>
            </p>
          </div>

          <ol className="flex flex-col">
            {modules.map((module, index) => (
              <li
                key={module.number}
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                className="border-paper-line grid grid-cols-[auto_1fr] items-start gap-6 border-t py-8 first:border-t-0 first:pt-0 last:pb-0 md:gap-8 md:py-10"
              >
                <span
                  aria-hidden
                  className={cn(
                    "numeral-vazado font-[family-name:var(--font-display)] text-[2.5rem] leading-[0.8] font-semibold tracking-[-0.04em] tabular-nums md:text-[3.25rem]",
                    index === active && "numeral-vazado-ativo",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <ModuleIcon
                      name={module.icon}
                      className={cn(
                        "h-6 w-6 shrink-0 transition-colors duration-500",
                        index === active ? "text-ink" : "text-ink/35",
                      )}
                    />
                    <span className="eyebrow text-graphite">
                      {module.number === "Bônus"
                        ? "Módulo bônus"
                        : `Módulo ${module.number}`}
                    </span>
                  </div>

                  <h3 className="font-[family-name:var(--font-display)] text-2xl leading-tight font-medium text-balance md:text-3xl">
                    {module.title}
                  </h3>

                  <p className="text-graphite max-w-[54ch] text-base leading-relaxed">
                    {module.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
