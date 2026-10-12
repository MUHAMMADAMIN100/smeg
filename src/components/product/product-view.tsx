"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Phone, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Button } from "@/components/ui/button";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { colorById, type ColorId } from "@/data/colors";
import { categoryById } from "@/data/categories";
import type { Product } from "@/data/types";
import { getVariant, productImage } from "@/lib/products";
import { orderLinks } from "@/lib/order";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

const TRUST = [
  { icon: ShieldCheck, text: "Официальная гарантия SMEG" },
  { icon: Truck, text: "Доставка по Таджикистану 1–3 дня" },
  { icon: CreditCard, text: "Рассрочка при заказе" },
];

export function ProductView({ product }: { product: Product }) {
  const params = useSearchParams();
  const reduce = useReducedMotion();

  const initial = getVariant(product, params.get("color") as ColorId | null).color;
  const [color, setColor] = useState<ColorId>(initial);
  const variant = getVariant(product, color);
  const meta = colorById[variant.color];
  const category = categoryById[product.category];

  const select = useCallback((next: ColorId) => {
    setColor(next);
    const search = new URLSearchParams(window.location.search);
    search.set("color", next);
    window.history.replaceState(null, "", `${window.location.pathname}?${search.toString()}`);
  }, []);

  const links = orderLinks({
    productName: product.name,
    model: variant.sku,
    colorName: meta.name,
    price: product.price,
    intent: product.badge === "preorder" ? "preorder" : "order",
    url: `${site.url}/catalog/${product.slug}?color=${variant.color}`,
  });

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Галерея */}
      <div className="lg:col-span-7">
        <div className="relative overflow-hidden bg-smoke">
          {product.badge && <Badge kind={product.badge} className="absolute top-5 left-5 z-10" />}
          <span className="t-small absolute top-5 right-5 z-10 uppercase tracking-[0.1em] text-muted">{variant.sku}</span>
          <div className="relative mx-auto aspect-square w-full max-w-[640px]">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={variant.sku}
                initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.22 } }}
                transition={{ type: "spring", stiffness: 230, damping: 24 }}
                className="absolute inset-[9%]"
              >
                <Image
                  src={productImage(variant.sku)}
                  alt={`${product.name} в цвете ${meta.name}`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="product-photo object-contain"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Цвета">
          {product.variants.map((v) => {
            const c = colorById[v.color];
            const active = v.color === variant.color;
            return (
              <li key={v.sku} className="shrink-0">
                <button
                  type="button"
                  onClick={() => select(v.color)}
                  aria-pressed={active}
                  aria-label={c.name}
                  title={c.name}
                  className={cn(
                    "relative size-20 cursor-pointer overflow-hidden border bg-smoke p-2 transition-[border-color] duration-300 sm:size-24",
                    active ? "border-ink" : "border-transparent hover:border-line-strong",
                  )}
                >
                  <Image src={productImage(v.sku)} alt="" fill sizes="96px" className="product-photo object-contain p-2" draggable={false} />
                  <span className="absolute right-1.5 bottom-1.5 size-3 rounded-full ring-1 ring-black/10" style={{ backgroundColor: c.hex }} aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Панель покупки */}
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-24">
          <p className="t-label text-muted">
            {category.name} · {product.model}
          </p>
          <h1 className="t-display mt-4 text-[clamp(2rem,4vw,3.2rem)]">{product.name}</h1>
          <p className="mt-4 text-[17px] font-light leading-relaxed text-muted">{product.short}</p>

          <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-6">
            <Price value={product.price} oldValue={product.oldPrice} size="lg" />
            <p className="t-small text-faint">Цена ориентировочная, уточняйте при заказе</p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-muted">
              Цвет: <span className="font-semibold text-ink">{meta.name}</span>
              <span className="text-faint"> · {meta.original}</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Цвет">
              {product.variants.map((v) => {
                const c = colorById[v.color];
                const active = v.color === variant.color;
                return (
                  <button
                    key={v.sku}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={c.name}
                    title={c.name}
                    onClick={() => select(v.color)}
                    className="relative flex size-11 cursor-pointer items-center justify-center transition-transform duration-300 ease-out-expo hover:scale-110"
                  >
                    <span className="size-9 rounded-full ring-1 ring-inset ring-black/10" style={{ backgroundColor: c.hex }} />
                    {active && (
                      <>
                        <motion.span
                          layoutId="product-color-ring"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                          className="absolute inset-0 rounded-full border border-ink"
                        />
                        <Check className={cn("absolute size-4", c.on === "light" ? "text-white" : "text-ink")} strokeWidth={2.5} aria-hidden />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button href={links.whatsapp} external size="lg" icon={<WhatsAppIcon className="size-5" />} iconPosition="left">
              {product.badge === "preorder" ? "Забронировать в WhatsApp" : "Заказать в WhatsApp"}
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button href={links.telegram} external variant="outline" icon={<TelegramIcon className="size-4" />} iconPosition="left">
                Telegram
              </Button>
              <Button href={links.phone} variant="outline" icon={<Phone className="size-4" strokeWidth={2} />} iconPosition="left">
                Позвонить
              </Button>
            </div>
          </div>

          <ul className="mt-8 space-y-3 border-t border-line pt-6">
            {TRUST.map((t) => (
              <li key={t.text} className="flex items-center gap-3 text-[15px] font-light text-muted">
                <t.icon className="size-[18px] shrink-0 text-ink" strokeWidth={1.5} aria-hidden />
                {t.text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
