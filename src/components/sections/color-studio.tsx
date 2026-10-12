"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { WhatsAppIcon } from "@/components/ui/icons";
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
    () => companions.filter((p) => p.slug !== hero.slug && p.variants.some((v) => v.color === active)).slice(0, 4),
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
    <section id="colors" className="py-10 sm:py-14" aria-labelledby="colors-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="t-label text-muted">Цвета Smeg</p>
              <h1 id="colors-title" className="t-display mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">
                Выберите свой цвет
              </h1>
              <p className="mt-5 max-w-lg text-[15px] font-light leading-relaxed text-muted sm:text-base">
                Десять фирменных оттенков. Нажмите на цвет, и холодильник FAB28 примерит его вместе с остальной техникой.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-8">
              <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0 lg:overflow-visible lg:px-0">
                {available.map((id) => {
                  const c = colorById[id];
                  const isActive = id === active;
                  return (
                    <li key={id} className="shrink-0 lg:border-b lg:border-line">
                      <button
                        type="button"
                        onClick={() => setActive(id)}
                        aria-pressed={isActive}
                        className={cn(
                          "group flex w-full cursor-pointer items-center gap-3 border py-2 pr-4 pl-2 text-left transition-colors duration-300 lg:border-0 lg:py-3 lg:pl-0",
                          isActive ? "border-ink" : "border-line hover:border-ink",
                        )}
                      >
                        <span className="relative size-8 shrink-0 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c.hex }}>
                          {isActive && (
                            <motion.span
                              layoutId="studio-ring"
                              transition={{ type: "spring", stiffness: 400, damping: 32 }}
                              className="absolute -inset-1 rounded-full border border-ink"
                            />
                          )}
                        </span>
                        <span className="min-w-0">
                          <span className={cn("block truncate text-[15px] leading-tight", isActive ? "font-semibold text-ink" : "font-light text-ink")}>{c.name}</span>
                          <span className="t-small block uppercase tracking-[0.12em] text-faint">{c.original}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <div className="mt-10 hidden lg:block">
              <p className="t-label text-muted">Также в цвете «{color.name}»</p>
              <CompanionRow matches={matches} active={active} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <div className="relative overflow-hidden transition-colors duration-700" style={{ backgroundColor: color.tint }}>
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={variant.sku}
                      initial={reduce ? false : { opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 1.03, transition: { duration: 0.25 } }}
                      transition={{ type: "spring", stiffness: 220, damping: 24 }}
                      className="absolute inset-x-[12%] inset-y-[6%]"
                    >
                      <Image
                        src={productImage(variant.sku)}
                        alt={`${hero.name} в цвете ${color.name}`}
                        fill
                        priority
                        sizes="(min-width: 1024px) 50vw, 90vw"
                        className="product-photo object-contain"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="t-label text-muted">
                    {hero.model} · {variant.sku}
                  </p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={active}
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                      className="t-section mt-2"
                    >
                      {color.name}
                    </motion.p>
                  </AnimatePresence>
                  <p className="mt-1 font-light text-muted">
                    {hero.name} · {formatPrice(hero.price)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button href={links.whatsapp} external icon={<WhatsAppIcon className="size-4" />} iconPosition="left">
                    Заказать в этом цвете
                  </Button>
                  <Button href={`/catalog/${hero.slug}?color=${active}`} variant="outline" aria-label={`Страница товара ${hero.name}`}>
                    Подробнее
                  </Button>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 lg:hidden">
              <p className="t-label text-muted">Также в цвете «{color.name}»</p>
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
    <div className="mt-4 grid grid-cols-4 gap-3">
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
                <div className="relative aspect-square overflow-hidden bg-smoke p-2 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                  <Image src={productImage(v.sku)} alt="" fill sizes="12vw" className="product-photo object-contain p-2" draggable={false} />
                </div>
                <p className="mt-2 truncate text-xs font-light text-ink">{p.name}</p>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {matches.length === 0 && (
        <p className="col-span-4 text-sm font-light text-muted">Пока только холодильник. Остальное — в каталоге.</p>
      )}
    </div>
  );
}
