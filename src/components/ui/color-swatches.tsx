"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { colorById, type ColorId } from "@/data/colors";
import { cn } from "@/lib/utils";

type ColorSwatchesProps = {
  colors: ColorId[];
  value: ColorId;
  onChange: (color: ColorId) => void;
  /** Уникальный префикс для layoutId, чтобы кольца разных карточек не смешивались. */
  id: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Переключать цвет при наведении, как в карточках каталога. */
  hover?: boolean;
  showNames?: boolean;
};

const sizes = {
  sm: "size-5",
  md: "size-7",
  lg: "size-10",
};

export function ColorSwatches({
  colors,
  value,
  onChange,
  id,
  size = "md",
  className,
  hover = false,
  showNames = false,
}: ColorSwatchesProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)} role="radiogroup" aria-label="Цвет">
      {colors.map((colorId) => {
        const color = colorById[colorId];
        const active = colorId === value;
        return (
          <button
            key={colorId}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={color.name}
            title={color.name}
            onClick={() => onChange(colorId)}
            onMouseEnter={hover ? () => onChange(colorId) : undefined}
            onFocus={hover ? () => onChange(colorId) : undefined}
            className={cn(
              "group/swatch relative flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 ease-out-expo hover:scale-110",
              sizes[size],
              showNames && "h-auto w-auto gap-2 rounded-full pr-3 pl-1 py-1 hover:scale-100",
            )}
          >
            <span
              className={cn(
                "block rounded-full ring-1 ring-inset ring-black/10",
                sizes[size],
              )}
              style={{ backgroundColor: color.hex }}
            />
            {showNames && (
              <span className={cn("text-sm font-medium", active ? "text-fg" : "text-fg-muted")}>{color.name}</span>
            )}
            {active && (
              <motion.span
                layoutId={`${id}-ring`}
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                className={cn(
                  "pointer-events-none absolute rounded-full border-[1.5px] border-fg",
                  showNames ? "inset-0" : "-inset-[3px]",
                )}
              />
            )}
            {active && size === "lg" && !showNames && (
              <Check
                className={cn("absolute size-4", color.on === "light" ? "text-white" : "text-ink")}
                strokeWidth={2.5}
                aria-hidden
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
