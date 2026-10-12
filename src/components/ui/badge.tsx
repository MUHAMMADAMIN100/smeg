import type { Badge as BadgeKind } from "@/data/types";
import { cn } from "@/lib/utils";

const labels: Record<BadgeKind, string> = {
  hit: "Хит",
  new: "Новинка",
  preorder: "Предзаказ",
};

const styles: Record<BadgeKind, string> = {
  hit: "bg-ink text-cream",
  new: "bg-pastel-mint text-ink",
  preorder: "bg-smeg text-white",
};

export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.14em]",
        styles[kind],
        className,
      )}
    >
      {labels[kind]}
    </span>
  );
}
