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
import { NAV_GROUPS, type NavGroup } from "@/lib/nav";
import { plural } from "@/lib/format";
import { cn } from "@/lib/utils";

const categoryIds = new Set(categories.map((c) => c.id));
const groupIds = new Set(NAV_GROUPS.map((g) => g.id));

export function CatalogView() {
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const rawCategory = params.get("category");
  const rawColor = params.get("color");
  const rawGroup = params.get("group");
  const category = rawCategory && categoryIds.has(rawCategory as CategoryId) ? (rawCategory as CategoryId) : null;
  const group = rawGroup && groupIds.has(rawGroup as NavGroup["id"]) ? NAV_GROUPS.find((g) => g.id === rawGroup)! : null;
  const catalogColors = useMemo(() => getCatalogColors(), []);
  const color = rawColor && catalogColors.includes(rawColor as ColorId) ? (rawColor as ColorId) : null;

  const counts = useMemo(() => getCategoryCounts(), []);
  const visibleCategories = group ? categories.filter((c) => group.categories.includes(c.id)) : categories;
  const list = filterProducts({ category, color, categories: group?.categories ?? null });

  const setParams = useCallback((patch: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    const query = next.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, []);

  const reset = () => window.history.replaceState(null, "", window.location.pathname);
  const hasFilters = Boolean(category || color || group);
  const title = category ? categoryById[category].name : group ? group.label : "Вся техника";

  return (
    <Container className="pb-24 pt-10 sm:pt-14">
      <div className="flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="t-label text-muted">Каталог</p>
          <h1 className="t-display mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">{title}</h1>
        </div>
        <p className="font-light text-muted" aria-live="polite">
          {list.length} {plural(list.length, ["товар", "товара", "товаров"])}
          {color && <> в цвете «{colorById[color].name}»</>}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        {/* Фильтры */}
        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Фильтры">
          <div className="flex items-center justify-between">
            <p className="t-label">Категория</p>
            {hasFilters && (
              <button
                type="button"
                onClick={reset}
                className="t-small inline-flex cursor-pointer items-center gap-1 text-muted transition-colors hover:text-ink"
              >
                <X className="size-3.5" strokeWidth={2} aria-hidden /> Сбросить
              </button>
            )}
          </div>
          <ul className="no-scrollbar -mx-5 mt-4 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:block lg:space-y-0 lg:overflow-visible lg:px-0">
            <li className="shrink-0">
              <FilterRow active={!category} onClick={() => setParams({ category: null })}>
                Все
                <span className="text-faint">{list.length && !category ? "" : ""}</span>
              </FilterRow>
            </li>
            {visibleCategories.map((c) => (
              <li key={c.id} className="shrink-0">
                <FilterRow
                  active={category === c.id}
                  onClick={() => setParams({ category: category === c.id ? null : c.id })}
                  count={counts[c.id]}
                >
                  {c.name}
                </FilterRow>
              </li>
            ))}
          </ul>

          <p className="t-label mt-8">Цвет</p>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Фильтр по цвету">
            <button
              type="button"
              aria-pressed={!color}
              onClick={() => setParams({ color: null })}
              className={cn(
                "t-small h-9 cursor-pointer border px-3 transition-colors",
                !color ? "border-ink bg-ink text-white" : "border-line text-muted hover:border-ink hover:text-ink",
              )}
            >
              Любой
            </button>
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
                  onClick={() => setParams({ color: active ? null : id })}
                  className="relative flex size-9 cursor-pointer items-center justify-center transition-transform duration-300 ease-out-expo hover:scale-110"
                >
                  <span className="size-6 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c.hex }} />
                  {active && (
                    <motion.span
                      layoutId="catalog-color-ring"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      className="absolute inset-0.5 rounded-full border border-ink"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Сетка */}
        {list.length > 0 ? (
          <motion.ul layout className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProductCard product={p} initialColor={color} priority={i < 4} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <div className="flex flex-col items-start gap-5 border border-dashed border-line-strong p-10">
            <p className="t-section">Ничего не нашли</p>
            <p className="max-w-md font-light text-muted">
              В этой категории пока нет товаров в выбранном цвете. Любой цвет из палитры SMEG привезём под заказ.
            </p>
            <Button variant="outline" onClick={reset}>
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}

function FilterRow({
  active,
  onClick,
  children,
  count,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex h-9 w-full cursor-pointer items-center gap-3 whitespace-nowrap border px-3 text-[15px] transition-colors lg:h-auto lg:border-0 lg:border-l-2 lg:px-0 lg:py-2 lg:pl-4",
        active
          ? "border-ink bg-ink font-semibold text-white lg:bg-transparent lg:text-ink"
          : "border-line font-light text-muted hover:border-ink hover:text-ink lg:border-transparent",
      )}
    >
      <span className="flex-1 text-left">{children}</span>
      {count !== undefined && <span className={cn("t-small", active ? "text-white/70 lg:text-faint" : "text-faint")}>{count}</span>}
    </button>
  );
}
