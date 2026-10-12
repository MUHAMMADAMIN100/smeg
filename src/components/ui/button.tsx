import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.14em] whitespace-nowrap select-none cursor-pointer transition-[background-color,color,border-color,transform] duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-ink-700",
  accent: "bg-ink text-white hover:bg-ink-700",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
  ghost: "text-ink hover:bg-smoke",
  inverse: "bg-white text-ink hover:bg-smoke",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-5",
  md: "h-12 px-7",
  lg: "h-14 px-9",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

type AsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type AsLink = CommonProps & {
  href: string;
  /** Открыть в новой вкладке (мессенджеры, Instagram). */
  external?: boolean;
  "aria-label"?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export type ButtonProps = AsButton | AsLink;

function isExternal(href: string) {
  return /^(https?:|tel:|mailto:)/.test(href);
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, icon, iconPosition = "right" } = props;
  const classes = cn(base, variants[variant], sizes[size], className);
  const content = (
    <>
      {icon && iconPosition === "left" && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="shrink-0 transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0.5">{icon}</span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, external, onClick } = props;
    const ariaLabel = props["aria-label"];
    if (external || isExternal(href)) {
      const newTab = external || href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          aria-label={ariaLabel}
          onClick={onClick}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href as Route} className={classes} aria-label={ariaLabel} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const own = new Set(["variant", "size", "className", "icon", "iconPosition", "children", "href"]);
  const rest = Object.fromEntries(
    Object.entries(props).filter(([key]) => !own.has(key)),
  ) as React.ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
