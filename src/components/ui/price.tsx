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
          "font-medium tabular-nums text-fg",
          size === "sm" && "text-[15px]",
          size === "md" && "text-lg",
          size === "lg" && "font-display text-3xl sm:text-4xl",
        )}
      >
        {formatPrice(value)}
      </span>
      {oldValue && oldValue > value && (
        <span className="text-sm tabular-nums text-fg-faint line-through">{formatPrice(oldValue)}</span>
      )}
    </span>
  );
}
