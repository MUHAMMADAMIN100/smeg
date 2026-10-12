"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ColorSwatches } from "@/components/ui/color-swatches";
import { colorById, type ColorId } from "@/data/colors";
import type { Product } from "@/data/types";
import { getVariant, productImage } from "@/lib/products";
import { orderLinks } from "@/lib/order";
import { formatPrice } from "@/lib/format";
import { site } from "@/data/site";

const HIGHLIGHTS = [
  { value: "7 л", label: "объём корзины" },
  { value: "2", label: "режима: воздух и пар" },
  { value: "7", label: "авто-программ" },
  { value: "40–200 °C", label: "диапазон температур" },
];

export function PreorderPromo({ product }: { product: Product }) {
  const reduce = useReducedMotion();
  const [color, setColor] = useState<ColorId>(product.variants[0].color);
  const variant = getVariant(product, color);
  const meta = colorById[variant.color];
  const links = orderLinks({
    productName: product.name,
    model: variant.sku,
    colorName: meta.name,
    price: product.price,
    intent: "preorder",
    url: `${site.url}/catalog/${product.slug}?color=${variant.color}`,
  });

  return (
    <section className="py-6 sm:py-10" aria-labelledby="preorder-title">
      <Container>
        <Reveal scale>
          <div className="relative overflow-hidden rounded-[40px] bg-ink text-cream">
            {/* Цветное свечение под активный цвет */}
            <motion.div
              animate={{ backgroundColor: meta.hex }}
              transition={{ duration: 1 }}
              className="pointer-events-none absolute -top-40 -right-40 size-[560px] rounded-full opacity-25 blur-3xl"
              aria-hidden
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(246,241,232,0.08),transparent_55%)]" aria-hidden />

            <div className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-12 lg:gap-6 lg:p-16">
              <div className="flex flex-col justify-between lg:col-span-6">
                <div>
                  <p className="eyebrow flex items-center gap-3 text-cream/60">
                    <span className="inline-flex h-7 items-center rounded-full bg-smeg px-3 text-[11px] font-semibold tracking-[0.14em] text-white">
                      Предзаказ
                    </span>
                    Новинка 2026 · будьте в числе первых
                  </p>
                  <h2 id="preorder-title" className="font-display mt-6 text-[clamp(2.4rem,5.5vw,5rem)] leading-[1] text-cream">
                    Аэрогриль
                    <br />
                    Dual Flavour
                  </h2>
                  <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/70">
                    Два характера в одном корпусе: горячий воздух для хрустящей корочки и пар, чтобы внутри осталось сочно. Готовит без масла, в стиле 50-х и четырёх матовых цветах.
                  </p>
                </div>

                <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-cream/15 pt-8 sm:grid-cols-4">
                  {HIGHLIGHTS.map((h) => (
                    <div key={h.label}>
                      <dt className="sr-only">{h.label}</dt>
                      <dd className="font-display text-2xl text-cream sm:text-3xl">{h.value}</dd>
                      <dd className="mt-1 text-xs text-cream/55 sm:text-sm">{h.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="lg:col-span-6">
                <div className="relative mx-auto aspect-square w-full max-w-[460px]">
                  <div className="blob absolute inset-[6%] bg-tray" aria-hidden />
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={variant.sku}
                      initial={reduce ? false : { opacity: 0, scale: 0.9, rotate: -4 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 220, damping: 22 }}
                      className="absolute inset-[12%]"
                    >
                      <Image
                        src={productImage(variant.sku)}
                        alt={`${product.name} в цвете ${meta.name}`}
                        fill
                        sizes="(min-width: 1024px) 36vw, 90vw"
                        className="product-photo object-contain"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="mt-2 flex flex-col gap-6 rounded-[28px] border border-cream/15 bg-cream/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/50">Цвет · {meta.name}</p>
                    <div className="mt-3 [&_[role=radio]_span]:ring-cream/20">
                      <ColorSwatches
                        id="preorder"
                        colors={product.variants.map((v) => v.color)}
                        value={variant.color}
                        onChange={setColor}
                        size="lg"
                        className="[&_.border-fg]:border-cream"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <p className="font-display text-2xl text-cream">{formatPrice(product.price)}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        href={links.whatsapp}
                        external
                        variant="accent"
                        size="sm"
                        icon={<MessageCircle className="size-4" strokeWidth={2} />}
                        iconPosition="left"
                      >
                        Забронировать
                      </Button>
                      <Button
                        href={`/catalog/${product.slug}?color=${variant.color}`}
                        variant="inverse"
                        size="sm"
                        icon={<ArrowUpRight className="size-4" strokeWidth={2} />}
                        className="bg-cream text-ink hover:bg-white"
                      >
                        Подробнее
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
