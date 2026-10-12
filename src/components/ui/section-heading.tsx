import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  size?: "md" | "lg";
  as?: "h1" | "h2" | "h3";
};

export function SectionHeading({
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
      {eyebrow && <p className="t-label text-muted">{eyebrow}</p>}
      <Tag
        className={cn(
          "text-balance text-ink",
          eyebrow && "mt-4",
          size === "md" && "t-section",
          size === "lg" && "t-display text-[clamp(2.2rem,5vw,3.6rem)]",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-5 max-w-xl text-[15px] font-light leading-relaxed text-muted sm:text-base", align === "center" && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
