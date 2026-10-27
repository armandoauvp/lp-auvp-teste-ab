import { ArrowRight, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Figure } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { community } from "@/content/community";
import { links } from "@/content/site";

/**
 * Dobra 06. Prova social pela fotografia dos encontros presenciais.
 *
 * Uma foto de largura cheia abre, e o resto vem em duas colunas: hoje são
 * quatro, duas linhas, o encontro anual em cima e o Giro da Bolsa Itinerante
 * embaixo. A grade não sabe disso, e é de propósito: ela mostra o que estiver
 * em `community.photos` depois da primeira, na ordem em que estiver lá.
 */
export function Community() {
  return (
    <Section id="comunidade" tone="warm" rule>
      <Container>
        <SectionHeading
          title={community.title}
          subtitle={community.subtitle}
          align="center"
          className="mx-auto"
        />

        <div className="mt-16 flex flex-col gap-6">
          <Reveal>
            <Figure
              src={community.photos[0].src}
              alt={community.photos[0].alt}
              caption={community.photos[0].caption}
              brief={community.photos[0].brief}
              ratio="3/2"
              sizes="(min-width: 1280px) 1216px, 100vw"
            />
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {community.photos.slice(1).map((photo, index) => (
              // O atraso é por coluna, e não por índice: numa segunda linha o
              // índice contínuo daria 220 e 330ms, e a última foto entraria
              // um terço de segundo depois da primeira da mesma linha.
              <Reveal key={photo.caption} delay={(index % 2) * 110}>
                <Figure
                  src={photo.src}
                  alt={photo.alt}
                  caption={photo.caption}
                  brief={photo.brief}
                  ratio="4/3"
                />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <Button href={links.community} variant="outline" size="lg">
            {community.ctaLabel}
            <ArrowRight />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
