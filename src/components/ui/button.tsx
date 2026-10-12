import Link from "next/link";
import type { Route } from "next";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "inverse";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight whitespace-nowrap select-none cursor-pointer transition-[background-color,color,border-color,transform,box-shadow] duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-fg text-bg hover:bg-smeg hover:text-white",
  accent:
    "bg-smeg text-white shadow-[0_12px_30px_-12px_rgba(215,40,47,0.65)] hover:bg-smeg-600 hover:shadow-[0_16px_36px_-12px_rgba(215,40,47,0.7)]",
  outline: "border border-line-strong text-fg hover:border-fg hover:bg-fg hover:text-bg",
  ghost: "text-fg hover:bg-surface-2",
  inverse: "bg-bg text-fg hover:bg-surface-2",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
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
      {icon && iconPosition === "left" && (
        <span className="transition-transform duration-300 ease-out-expo group-hover/btn:-translate-x-0.5">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <span className="transition-transform duration-300 ease-out-expo group-hover/btn:translate-x-0.5">{icon}</span>
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
