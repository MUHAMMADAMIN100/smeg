import type { Badge as BadgeKind } from "@/data/types";
import { cn } from "@/lib/utils";

const labels: Record<BadgeKind, string> = {
  hit: "Хит",
  new: "Новинка",
  preorder: "Предзаказ",
};

const styles: Record<BadgeKind, string> = {
  hit: "bg-ink text-white",
  new: "bg-white text-ink border border-ink",
  preorder: "bg-smeg text-white",
};

export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center px-2.5 text-[10px] font-bold uppercase tracking-[0.14em]",
        styles[kind],
        className,
      )}
    >
      {labels[kind]}
    </span>
  );
}
