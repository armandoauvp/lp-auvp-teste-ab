import { usePassouOHero } from "@/components/layout/heroHandoff";
import { contact, links } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/ModuleIcon";
import { cn } from "@/lib/cn";

/**
 * Botão flutuante do canto inferior direito, da segunda dobra em diante.
 *
 * Na abertura ele não entra. A primeira dobra tem um caminho só, o botão
 * amarelo, e um disco escuro flutuando sobre a fotografia disputava com ele sem
 * oferecer nada que a página ainda não tivesse oferecido.
 *
 * Lê o mesmo `usePassouOHero` da barra fixa: os dois trocam de estado no mesmo
 * pixel.
 *
 * **Amarelo, e não tinta.** O disco era `ink` e sumia nas dobras de fundo
 * preto (processo, ETFs, convite), justo onde a página fica mais longa. O
 * amarelo é a única cor da escola que se destaca tanto sobre papel quanto
 * sobre tinta.
 */
export function WhatsAppFloat() {
  const passou = usePassouOHero();

  return (
    <a
      href={links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={contact.whatsappLabel}
      inert={!passou || undefined}
      className={cn(
        "bg-yellow text-ink hover:bg-yellow-soft ring-ink/10 fixed right-5 bottom-5 z-40 flex h-13 w-13 items-center justify-center rounded-full shadow-[0_8px_28px_rgba(16,16,16,0.32)] ring-1 transition-[opacity,transform,background-color] duration-500 ease-out hover:scale-105 md:right-8 md:bottom-8",
        passou ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
