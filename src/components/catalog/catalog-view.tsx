"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { Button } from "@/components/ui/button";
import { categories, categoryById, type CategoryId } from "@/data/categories";
import { colorById, type ColorId } from "@/data/colors";
import { filterProducts, getCatalogColors, getCategoryCounts } from "@/lib/products";
import { plural } from "@/lib/format";
import { cn } from "@/lib/utils";

const categoryIds = new Set(categories.map((c) => c.id));

export function CatalogView() {
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const rawCategory = params.get("category");
  const rawColor = params.get("color");
  const category = rawCategory && categoryIds.has(rawCategory as CategoryId) ? (rawCategory as CategoryId) : null;
  const catalogColors = useMemo(() => getCatalogColors(), []);
  const color = rawColor && catalogColors.includes(rawColor as ColorId) ? (rawColor as ColorId) : null;

  const counts = useMemo(() => getCategoryCounts(), []);
  const list = useMemo(() => filterProducts({ category, color }), [category, color]);

  const setParam = useCallback(
    (key: "category" | "color", value: string | null) => {
      const next = new URLSearchParams(window.location.search);
      if (value) next.set(key, value);
      else next.delete(key);
      const query = next.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
    },
    [],
  );

  const reset = () => window.history.replaceState(null, "", window.location.pathname);
  const hasFilters = Boolean(category || color);

  return (
    <Container className="pb-24 pt-10 sm:pt-14">
      {/* Заголовок */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Каталог</p>
          <h1 className="font-display mt-4 text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] text-fg">
            {category ? categoryById[category].name : "Вся техника"}
          </h1>
        </div>
        <p className="text-fg-muted md:pb-3" aria-live="polite">
          {list.length} {plural(list.length, ["товар", "товара", "товаров"])}
          {color && (
            <>
              {" "}в цвете «{colorById[color].name}»
            </>
          )}
        </p>
      </div>

      {/* Фильтры */}
      <div className="mt-10 space-y-5 border-y border-line py-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="eyebrow w-24 shrink-0">01 · Категория</span>
          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
            <Chip active={!category} onClick={() => setParam("category", null)}>
              Все
            </Chip>
            {categories.map((c) => (
              <Chip key={c.id} active={category === c.id} onClick={() => setParam("category", category === c.id ? null : c.id)} dot={c.tint}>
                {c.name}
                <span className="ml-1.5 text-fg-faint">{counts[c.id]}</span>
              </Chip>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="eyebrow w-24 shrink-0">02 · Цвет</span>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Фильтр по цвету">
            <Chip active={!color} onClick={() => setParam("color", null)}>
              Любой
            </Chip>
            {catalogColors.map((id) => {
              const c = colorById[id];
              const active = color === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  aria-label={c.name}
                  title={c.name}
                  onClick={() => setParam("color", active ? null : id)}
                  className={cn(
                    "relative flex size-9 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 ease-out-expo hover:scale-110",
                  )}
                >
                  <span className="size-7 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c.hex }} />
                  {active && (
                    <motion.span
                      layoutId="catalog-color-ring"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      className="absolute inset-0 rounded-full border-[1.5px] border-fg"
                    />
                  )}
                </button>
              );
            })}
          </div>
          {hasFilters && (
            <button
              type="button"
              onClick={reset}
              className="ml-auto inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-fg-muted transition-colors hover:text-smeg"
            >
              <X className="size-4" strokeWidth={2} aria-hidden /> Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Сетка */}
      {list.length > 0 ? (
        <motion.ul layout className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <motion.li
                key={p.slug}
                layout
                initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={p} initialColor={color} priority={i < 4} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mt-16 flex flex-col items-start gap-5 rounded-[28px] border border-dashed border-line-strong p-10">
          <p className="font-display text-3xl text-fg">Ничего не нашли</p>
          <p className="max-w-md text-fg-muted">
            В этой категории пока нет товаров в выбранном цвете. Любой цвет из палитры SMEG привезём под заказ.
          </p>
          <Button variant="outline" onClick={reset}>
            Сбросить фильтры
          </Button>
        </div>
      )}
    </Container>
  );
}

function Chip({
  active,
  onClick,
  children,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  dot?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[background-color,color,border-color] duration-300",
        active
          ? "border-fg bg-fg text-bg"
          : "border-line text-fg-muted hover:border-fg hover:text-fg",
      )}
    >
      {dot && <span className={cn("size-2 rounded-full", active && "ring-1 ring-bg/60")} style={{ backgroundColor: dot }} aria-hidden />}
      {children}
    </button>
  );
}
