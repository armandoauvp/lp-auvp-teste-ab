import { ArrowRight, Button } from "@/components/ui/Button";
import { ClassCountdown } from "@/components/sections/ClassCountdown";
import { Container } from "@/components/ui/Container";
import { BackdropReserve } from "@/components/ui/Figure";
import { Reveal } from "@/components/ui/Reveal";
import { closing } from "@/content/closing";
import { links, site } from "@/content/site";
import { asset } from "@/lib/asset";
import { srcset } from "@/lib/srcset";

/**
 * O convite, com o prazo da próxima turma. Não consta do roteiro original, mas
 * uma página institucional longa precisa devolver o leitor a uma ação. Sem
 * ele, a jornada termina no rodapé.
 *
 * Ficou um tempo depois do FAQ, e mudou de lugar: quem chega ao fim dos
 * apoiadores já tem o que precisa para decidir, e o FAQ existe para quem ficou
 * com uma dúvida específica. Pôr a decisão depois de doze perguntas era fazer
 * todo mundo passar pela objeção de alguém.
 *
 * O tom continua fechando a sequência sem repetir o vizinho: apoiadores em
 * papel, esta em tinta, o FAQ em papel quente.
 */
export function ClosingCta() {
  return (
    <section className="bg-ink text-paper relative isolate overflow-hidden">
      {closing.photo.src ? (
        <img
          src={asset(closing.photo.src)}
          srcSet={srcset(closing.photo.src)}
          sizes="(max-aspect-ratio: 3/2) 150vh, 100vw"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center opacity-25"
        />
      ) : (
        <BackdropReserve brief={closing.photo.brief} />
      )}
      <div
        aria-hidden
        className="from-ink via-ink/92 to-ink/70 absolute inset-0 bg-gradient-to-r"
      />

      <Container className="relative py-24 md:py-32">
        {/*
          Duas colunas a partir de `lg`: o convite de um lado, o prazo do outro.
          O contador esteve empilhado abaixo do texto, e ali competia com o
          botão pelo mesmo lugar na leitura. Numa coluna própria ele vira o dado
          que justifica o clique, e não mais um bloco na fila.

          Ele fica na coluna da direita, e não na da esquerda: assim o título
          desta dobra começa nos mesmos 152px de todos os outros títulos
          alinhados à esquerda da página, e o fecho deixa de ser uma exceção de
          grade. Quem chega aqui já leu a página inteira nessa margem.

          **As duas colunas se encostam numa régua, e não num vão.** Antes havia
          um `gap` largo entre elas, e o contador flutuava no meio do preto sem
          nada que o prendesse à página: parecia uma sobra, não uma coluna. A
          régua vertical, que vai de ponta a ponta pelo `items-stretch`, dá à
          direita a mesma borda que a esquerda tem na margem do container. É a
          mesma régua que separa colunas no resto da página.

          Empilhado, a régua deita e vira `border-t`, que é o comportamento
          natural dela: separa o que está acima do que está abaixo.

          A ordem do DOM é a ordem visual nos dois casos, sem `order` para
          inverter coluna: empilhado, o convite abre a dobra e o prazo vem
          logo abaixo do botão. Trocar com `order` deixaria quem navega por
          teclado ou leitor de tela numa sequência diferente da que vê.
        */}
        <div className="grid items-stretch gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-0">
          <Reveal className="flex flex-col items-start justify-center gap-7 lg:pr-14 xl:pr-20">
            <p className="eyebrow text-yellow">{closing.eyebrow}</p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl leading-[1.08] font-medium tracking-[-0.01em] text-balance md:text-5xl">
              {closing.title}
            </h2>
            <p className="text-mist max-w-[46ch] text-base leading-relaxed md:text-lg">
              {site.shortName} avalia o perfil de cada candidato antes da
              matrícula. Leva poucos minutos e não custa nada.
            </p>

            <Button
              href={links.profileAnalysis}
              variant="yellow"
              size="lg"
              className="mt-2"
            >
              {closing.ctaLabel}
              <ArrowRight />
            </Button>
          </Reveal>

          <Reveal
            delay={90}
            className="border-paper/15 flex flex-col justify-center border-t pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14 xl:pl-20"
          >
            <ClassCountdown />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
