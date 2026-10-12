import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: React.ReactNode[];
  className?: string;
  /** Секунды на полный круг. */
  speed?: number;
  itemClassName?: string;
};

export function Marquee({ items, className, speed = 40, itemClassName }: MarqueeProps) {
  const copy = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className={cn("flex items-center gap-8 pr-8", itemClassName)}>
          <span>{item}</span>
          <span className="size-1.5 shrink-0 rounded-full bg-smeg" aria-hidden />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("marquee flex w-full overflow-hidden", className)}
      style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}
    >
      <div className="marquee-track flex w-max shrink-0">
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}
