"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { colorById, studioColorIds, type ColorId } from "@/data/colors";
import type { Product } from "@/data/types";
import { getVariant, productImage } from "@/lib/products";
import { orderLinks } from "@/lib/order";
import { formatPrice } from "@/lib/format";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type ColorStudioProps = {
  /** Главный товар студии, обычно FAB28. */
  hero: Product;
  /** Товары для ряда «также в этом цвете». */
  companions: Product[];
};

export function ColorStudio({ hero, companions }: ColorStudioProps) {
  const reduce = useReducedMotion();
  const available = useMemo(
    () => studioColorIds.filter((id) => hero.variants.some((v) => v.color === id)),
    [hero],
  );
  const [active, setActive] = useState<ColorId>(available[0]);
  const color = colorById[active];
  const variant = getVariant(hero, active);

  const matches = useMemo(
    () =>
      companions
        .filter((p) => p.slug !== hero.slug && p.variants.some((v) => v.color === active))
        .slice(0, 4),
    [companions, hero.slug, active],
  );

  const links = orderLinks({
    productName: hero.name,
    model: variant.sku,
    colorName: color.name,
    price: hero.price,
    url: `${site.url}/catalog/${hero.slug}?color=${active}`,
  });

  return (
    <section
      id="colors"
      className="scroll-mt-20 py-20 transition-colors duration-700 sm:py-28 bg-(--tint) dark:bg-(--tint-dark)"
      style={{ "--tint": color.tint, "--tint-dark": color.tintDark } as React.CSSProperties}
      aria-labelledby="colors-title"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Левая колонка: заголовок и список цветов */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                number="02"
                eyebrow="Цветовая студия"
                title={<span id="colors-title">Выберите свой цвет</span>}
                description="Десять фирменных оттенков SMEG. Нажмите на цвет, и холодильник FAB28 примерит его вместе с остальной техникой."
              />
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <ul className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-2 lg:overflow-visible lg:px-0">
                {available.map((id) => {
                  const c = colorById[id];
                  const isActive = id === active;
                  return (
                    <li key={id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => setActive(id)}
                        aria-pressed={isActive}
                        className={cn(
                          "group flex w-full cursor-pointer items-center gap-3 rounded-full border py-2 pr-5 pl-2 text-left transition-[background-color,border-color,transform] duration-300 ease-out-expo",
                          isActive
                            ? "border-fg/70 bg-surface"
                            : "border-transparent hover:border-fg/30 hover:bg-surface/60",
                        )}
                      >
                        <span
                          className="relative size-9 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
                          style={{ backgroundColor: c.hex }}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="studio-ring"
                              transition={{ type: "spring", stiffness: 400, damping: 32 }}
                              className="absolute -inset-1 rounded-full border-[1.5px] border-fg"
                            />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-medium leading-tight text-fg">{c.name}</span>
                          <span className="block text-[11px] uppercase tracking-[0.16em] text-fg-muted">{c.original}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            {/* Также в этом цвете */}
            <div className="mt-10 hidden lg:block">
              <p className="eyebrow mb-4">Также в цвете «{color.name}»</p>
              <CompanionRow matches={matches} active={active} />
            </div>
          </div>

          {/* Правая колонка: сцена */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1} scale>
              <div className="relative overflow-hidden rounded-[36px] border border-fg/10 bg-surface/70 p-6 backdrop-blur-sm sm:p-10">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
                  <motion.div
                    animate={{ backgroundColor: color.hex }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="blob absolute inset-x-[6%] top-[10%] bottom-[10%] opacity-70"
                    aria-hidden
                  />
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={variant.sku}
                      initial={reduce ? false : { opacity: 0, y: 50, rotate: -3, scale: 0.94 }}
                      animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -40, scale: 1.03, transition: { duration: 0.25 } }}
                      transition={{ type: "spring", stiffness: 220, damping: 24 }}
                      className="absolute inset-x-[10%] inset-y-0"
                    >
                      <Image
                        src={productImage(variant.sku)}
                        alt={`${hero.name} в цвете ${color.name}`}
                        fill
                        sizes="(min-width: 1024px) 40vw, 90vw"
                        className="product-photo object-contain drop-shadow-[0_40px_40px_rgba(21,19,15,0.14)]"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow">{hero.model} · {variant.sku}</p>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={active}
                        initial={reduce ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="font-display mt-2 text-3xl text-fg"
                      >
                        {color.name}
                      </motion.p>
                    </AnimatePresence>
                    <p className="mt-1 text-fg-muted">{hero.name} · {formatPrice(hero.price)}</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      href={links.whatsapp}
                      external
                      variant="accent"
                      icon={<MessageCircle className="size-4" strokeWidth={2} />}
                      iconPosition="left"
                    >
                      Заказать в этом цвете
                    </Button>
                    <Button
                      href={`/catalog/${hero.slug}?color=${active}`}
                      variant="outline"
                      icon={<ArrowUpRight className="size-4" strokeWidth={2} />}
                      aria-label={`Страница товара ${hero.name}`}
                    >
                      Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 lg:hidden">
              <p className="eyebrow mb-4">Также в цвете «{color.name}»</p>
              <CompanionRow matches={matches} active={active} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CompanionRow({ matches, active }: { matches: Product[]; active: ColorId }) {
  const reduce = useReducedMotion();
  return (
    <div className="grid grid-cols-4 gap-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {matches.map((p, i) => {
          const v = getVariant(p, active);
          return (
            <motion.div
              key={`${p.slug}-${v.sku}`}
              layout
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={`/catalog/${p.slug}?color=${active}` as Route}
                className="group block"
                aria-label={`${p.name} в цвете ${colorById[active].name}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-fg/10 bg-tray p-2 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                  <Image
                    src={productImage(v.sku)}
                    alt=""
                    fill
                    sizes="12vw"
                    className="product-photo object-contain p-2"
                    draggable={false}
                  />
                </div>
                <p className="mt-2 truncate text-xs font-medium text-fg">{p.name}</p>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {matches.length === 0 && (
        <p className="col-span-4 text-sm text-fg-muted">Пока только холодильник. Остальное — в каталоге.</p>
      )}
    </div>
  );
}
