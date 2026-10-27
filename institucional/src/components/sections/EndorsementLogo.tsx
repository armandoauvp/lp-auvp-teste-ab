import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";

/**
 * Logo de apoiador, com o nome como reserva.
 *
 * Existe por um motivo concreto: as três logos que temos hoje vêm do CDN da
 * AUVP, e não de `public/`. Se alguma sair do ar, mudar de endereço ou não
 * carregar, o carrossel mostraria o ícone de imagem quebrada. Com a reserva,
 * ele volta a exibir o nome em versalete, que era o estado anterior e continua
 * apresentável.
 *
 * As logos aparecem em preto e branco. São marcas de quatro donos diferentes,
 * cada uma com a própria paleta, e lado a lado em cor própria elas viravam a
 * área mais colorida de uma página de três cores. Em escala de cinza a fileira
 * lê como um conjunto, que é o que a dobra afirma.
 *
 * O `mix-blend-multiply` continua: sobre papel branco é neutro para o desenho
 * (multiplicar por branco não muda pixel nenhum) e some com fundo branco
 * chapado, caso algum arquivo tenha um. Nenhum dos três arquivos servidos pelo
 * CDN foi conferido visualmente. Ver docs/ASSETS.md.
 */
export function EndorsementLogo({
  name,
  logo,
}: {
  name: string;
  logo: string | null;
}) {
  const [falhou, setFalhou] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  // A página chega pré-renderizada: se a logo falhar antes de o React
  // hidratar, o `onError` já passou. Conferimos o estado na montagem.
  useEffect(() => {
    const el = img.current;
    if (el?.complete && el.naturalWidth === 0) setFalhou(true);
  }, []);

  if (!logo || falhou) {
    return (
      <span className="eyebrow text-graphite/80 text-center text-base tracking-[0.2em]">
        {name}
      </span>
    );
  }

  return (
    <img
      ref={img}
      src={asset(logo)}
      alt={name}
      width={320}
      height={120}
      loading="lazy"
      onError={() => setFalhou(true)}
      className="h-12 w-auto max-w-full object-contain mix-blend-multiply grayscale md:h-14"
    />
  );
}
