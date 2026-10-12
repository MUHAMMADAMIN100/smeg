import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  number?: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Размер заголовка. */
  size?: "md" | "lg";
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  number,
  eyebrow,
  title,
  description,
  align = "left",
  className,
  size = "md",
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center")}>
        {number && <span className="font-display text-base tracking-normal text-fg">{number}</span>}
        {number && <span className="h-px w-8 bg-line-strong" aria-hidden />}
        <span>{eyebrow}</span>
      </p>
      <Tag
        className={cn(
          "font-display mt-5 text-balance leading-[1.02] text-fg",
          size === "md" && "text-[clamp(2.1rem,4.6vw,4.2rem)]",
          size === "lg" && "text-[clamp(2.6rem,6vw,5.6rem)]",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-5 max-w-xl text-lg leading-relaxed text-fg-muted", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
