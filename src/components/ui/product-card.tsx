"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { Product } from "@/data/types";
import { colorById, type ColorId } from "@/data/colors";
import { categoryById } from "@/data/categories";
import { getVariant, productImage } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { ColorSwatches } from "@/components/ui/color-swatches";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
  /** Цвет по умолчанию, например из фильтра каталога. */
  initialColor?: ColorId | null;
  sizes?: string;
};

export function ProductCard({
  product,
  className,
  priority = false,
  initialColor,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 45vw",
}: ProductCardProps) {
  const [color, setColor] = useState<ColorId>(getVariant(product, initialColor).color);
  // Фильтр каталога сменил цвет: подхватываем его без эффекта, паттерном «состояние из пропсов».
  const [prevInitial, setPrevInitial] = useState(initialColor);
  if (initialColor !== prevInitial) {
    setPrevInitial(initialColor);
    if (initialColor && product.variants.some((v) => v.color === initialColor)) setColor(initialColor);
  }
  const variant = getVariant(product, color);
  const colorMeta = colorById[variant.color];
  const reduce = useReducedMotion();

  // Лёгкий наклон карточки за курсором.
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 180, damping: 20 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  const href = `/catalog/${product.slug}?color=${variant.color}` as Route;
  const colorIds = product.variants.map((v) => v.color);

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={cn("group relative flex h-full flex-col bg-white", className)}
    >
      <Link href={href} className="block" aria-label={`${product.name}, ${colorMeta.name}`}>
        <div className="relative aspect-square overflow-hidden bg-smoke">
          {product.badge && <Badge kind={product.badge} className="absolute top-3 left-3 z-10" />}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={variant.sku}
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.03 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="absolute inset-0 p-6 transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
            >
              <Image
                src={productImage(variant.sku)}
                alt={`${product.name} ${colorMeta.name}`}
                fill
                sizes={sizes}
                priority={priority}
                className="product-photo object-contain"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="t-small uppercase tracking-[0.1em] text-muted">
          {categoryById[product.category].name} · {product.model}
        </p>
        <Link href={href} className="mt-1.5 block">
          <h3 className="text-[17px] font-light leading-snug text-ink transition-colors group-hover:text-muted">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <Price value={product.price} oldValue={product.oldPrice} size="sm" />
          <ColorSwatches
            id={`card-${product.slug}`}
            colors={colorIds.slice(0, 7)}
            value={variant.color}
            onChange={setColor}
            size="sm"
            hover
          />
        </div>
      </div>
    </motion.article>
  );
}
