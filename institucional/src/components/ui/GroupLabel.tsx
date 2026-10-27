import { cn } from "@/lib/cn";

type GroupLabelProps = {
  children: React.ReactNode;
  className?: string;
  tone?: "light" | "dark";
};

/**
 * Nome de um grupo de cards, em serifa italica.
 *
 * Diferente do rotulo que existia antes de cada titulo, este nao e decoracao:
 * ele separa "Produtos" de "Parceria e presenca internacional" dentro da mesma
 * dobra, e sem ele os dois grupos viram uma lista so. Sem filete e sem
 * versalete, para nao reintroduzir a etiqueta que foi removida dos titulos.
 */
export function GroupLabel({
  children,
  className,
  tone = "light",
}: GroupLabelProps) {
  return (
    <p
      className={cn(
        "font-[family-name:var(--font-display)] text-xl italic",
        tone === "light" ? "text-ink/70" : "text-yellow",
        className,
      )}
    >
      {children}
    </p>
  );
}
