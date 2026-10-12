import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  value,
  oldValue,
  className,
  size = "md",
}: {
  value: number;
  oldValue?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", className)}>
      <span
        className={cn(
          "tabular-nums text-ink",
          size === "sm" && "text-[15px] font-semibold",
          size === "md" && "text-lg font-semibold",
          size === "lg" && "text-3xl font-light sm:text-4xl",
        )}
      >
        {formatPrice(value)}
      </span>
      {oldValue && oldValue > value && (
        <span className="text-sm tabular-nums text-faint line-through">{formatPrice(oldValue)}</span>
      )}
    </span>
  );
}
