import { useId, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq, faqCategories } from "@/content/faq";
import { cn } from "@/lib/cn";

/**
 * Última dobra. Menu vertical de categorias à esquerda, acordeão à direita.
 *
 * É a última de propósito: o convite vem antes, e o que sobra aqui é a dúvida
 * de quem ainda tem uma. Ver `ClosingCta`.
 *
 * Usa <details>/<summary> nativos: o conteúdo continua acessível e indexável
 * mesmo antes da hidratação, e o teclado funciona sem qualquer handler nosso.
 * O React só controla qual categoria está em tela.
 */
export function Faq() {
  const [active, setActive] = useState(faqCategories[0].id);
  const listId = useId();
  const current =
    faqCategories.find((category) => category.id === active) ??
    faqCategories[0];

  return (
    <Section id="faq" tone="warm" rule>
      <Container>
        <SectionHeading title={faq.title} />

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Categorias de dúvidas" className="min-w-0">
            <ul
              role="tablist"
              aria-orientation="vertical"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0"
            >
              {faqCategories.map((category) => {
                const selected = category.id === active;
                return (
                  <li
                    key={category.id}
                    role="presentation"
                    className="shrink-0"
                  >
                    <button
                      type="button"
                      role="tab"
                      id={`${listId}-tab-${category.id}`}
                      aria-selected={selected}
                      aria-controls={`${listId}-panel`}
                      onClick={() => setActive(category.id)}
                      className={cn(
                        "w-full border-b-2 px-4 py-3 text-left text-sm whitespace-nowrap transition-colors duration-300 lg:border-b-0 lg:border-l-2 lg:px-5",
                        selected
                          ? "border-ink text-ink font-medium"
                          : "text-graphite hover:border-paper-line hover:text-ink lg:border-l-paper-line border-transparent",
                      )}
                    >
                      {category.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            role="tabpanel"
            id={`${listId}-panel`}
            aria-labelledby={`${listId}-tab-${current.id}`}
            className="border-paper-line flex min-w-0 flex-col border-t"
          >
            {current.items.map((item, index) => (
              <Reveal key={item.question} delay={index * 60}>
                <details
                  name={`faq-${current.id}`}
                  className="group border-paper-line border-b"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                    <h3 className="text-ink font-[family-name:var(--font-display)] text-xl leading-snug font-medium md:text-2xl">
                      {item.question}
                    </h3>
                    <span
                      aria-hidden
                      className="text-ink relative mt-2 h-3 w-3 shrink-0"
                    >
                      <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                      <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 group-open:scale-y-0" />
                    </span>
                  </summary>
                  <p className="text-graphite max-w-[68ch] pr-10 pb-7 text-base leading-[1.75]">
                    {item.answer}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
