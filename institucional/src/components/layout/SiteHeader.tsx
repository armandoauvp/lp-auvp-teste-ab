import { useEffect, useState } from "react";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { usePassouOHero } from "@/components/layout/heroHandoff";
import { primaryNav } from "@/content/navigation";
import { links } from "@/content/site";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";

/**
 * Barra fixa, no topo do começo ao fim.
 *
 * **É a mesma barra nos dois estados.** Logo, itens e botão da área do aluno
 * aparecem no mesmo lugar e no mesmo tamanho sobre a primeira dobra e sobre o
 * resto da página. O que muda é a cor deles e o que existe atrás: sobre o hero,
 * só a borda de baixo, um filete branco; depois, o fundo de papel. A borda é o
 * mesmo elemento nos dois casos, então a linha da abertura e o pé do fundo
 * branco caem no mesmo ponto da grade.
 *
 * Houve uma versão com dois menus, um no hero e outro na barra, dissolvendo um
 * no outro. Por mais suave que fosse a dissolução, os itens escorregavam na
 * horizontal no meio do caminho: eram elementos diferentes, em grades
 * diferentes. Não voltar a isso.
 *
 * A troca de estado é geométrica, no `usePassouOHero`, e não um `scrollY` contra
 * um número escolhido a dedo.
 */
export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const encaixado = usePassouOHero();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  /**
   * Marca no menu a dobra que está em tela. Um IntersectionObserver com faixa
   * central estreita evita a oscilação típica de comparar `scrollY` com offsets.
   */
  useEffect(() => {
    const targets = primaryNav
      .filter((item) => item.href.startsWith("#"))
      .map((item) => document.querySelector(item.href))
      .filter((node): node is Element => node !== null);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries.find((entry) => entry.isIntersecting);
        if (inView) setActiveSection(`#${inView.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const onPaper = encaixado || menuOpen;

  return (
    <header
      className={cn(
        // A borda de baixo é o mesmo elemento nos dois estados, e é por isso
        // que a linha do hero e o pé do fundo branco caem no mesmo lugar: o que
        // muda é só a cor dela e o fundo atrás.
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
        onPaper
          ? "border-paper-line bg-paper/95 backdrop-blur-sm"
          : "border-paper/25",
      )}
    >
      {/* Largura total, com a mesma margem lateral do hero. Dentro do
          `Container` a barra parava 152px antes da borda e a linha dela não
          batia com nada. Ao mexer no `px` daqui, mexer no do hero junto. */}
      <div className="flex h-24 items-center justify-between gap-8 px-6 md:px-10 lg:px-10 xl:px-14">
        <a
          href="#principal"
          className="flex shrink-0 items-center"
          aria-label="AUVP Escola de Investimentos, início"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src={asset(
              onPaper
                ? "/logos/auvp-escola-serif-olho-preta.svg"
                : "/logos/auvp-escola-serif-olho-branca.svg",
            )}
            alt="AUVP Escola de Investimentos"
            width={1237}
            height={203}
            fetchPriority="high"
            className="h-10 w-auto md:h-12"
          />
        </a>

        {/* O menu é o mesmo nos dois estados: nunca some, nunca se desloca.
            Do hero para a página só a cor dos itens muda. */}
        {/*
          Entre 1024 e 1180px os quatro itens não cabiam entre o logo e o botão
          da área do aluno, e quebravam em duas linhas. Nessa faixa eles entram
          menores e mais juntos, e voltam ao corpo cheio a partir de `xl`.
        */}
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-5 lg:flex xl:gap-9"
        >
          {primaryNav.map((item) => {
            const current = item.href === activeSection;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "group relative text-[0.8125rem] whitespace-nowrap transition-colors duration-300 xl:text-sm",
                  onPaper
                    ? current
                      ? "text-ink"
                      : "text-graphite hover:text-ink"
                    : current
                      ? "text-paper"
                      : "text-paper/75 hover:text-paper",
                )}
              >
                {item.label}
                {/* Filete que cresce do centro: no hover e, fixo, na dobra atual. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-1.5 left-0 h-px w-full origin-center scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100",
                    current && "scale-x-100",
                    onPaper ? "bg-ink" : "bg-yellow",
                  )}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={links.studentArea}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "hidden rounded-full border px-5 py-2.5 text-[0.8125rem] font-medium tracking-[0.06em] transition-colors duration-500 ease-out sm:inline-flex",
              onPaper
                ? "border-ink/25 text-ink hover:bg-ink hover:text-paper"
                : "border-paper/35 text-paper hover:bg-paper hover:text-ink",
            )}
          >
            Área do aluno
          </a>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            className={cn(
              "-mr-2 p-2 lg:hidden",
              onPaper ? "text-ink" : "text-paper",
            )}
          >
            <span className="sr-only">
              {menuOpen ? "Fechar menu" : "Abrir menu"}
            </span>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3.5 8h17M3.5 16h17" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          id="menu-mobile"
          className="border-paper-line bg-paper h-[calc(100svh-6rem)] overflow-y-auto border-t lg:hidden"
        >
          <div className="flex flex-col px-6 py-4 md:px-10 lg:px-14">
            {primaryNav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-paper-line text-ink border-b py-4 font-[family-name:var(--font-display)] text-2xl last:border-b-0"
              >
                {item.label}
              </a>
            ))}
            <a
              href={links.studentArea}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink text-paper mt-5 mb-2 inline-flex justify-center rounded-full px-6 py-3.5 text-sm font-medium tracking-[0.08em] sm:hidden"
            >
              Área do aluno
            </a>
          </div>
        </div>
      ) : null}

      {encaixado && !menuOpen ? <ScrollProgress /> : null}
    </header>
  );
}
