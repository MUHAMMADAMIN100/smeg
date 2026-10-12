"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
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
  /** Приоритетная загрузка картинки для первых карточек. */
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
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 80vw",
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
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 180, damping: 20 });

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
      className={cn(
        "group relative flex h-full flex-col rounded-[28px] border border-line bg-surface p-3 transition-[border-color,box-shadow] duration-500 ease-out-expo hover:border-line-strong hover:shadow-[0_30px_60px_-30px_hsl(var(--shadow-color)/0.35)]",
        className,
      )}
    >
      <Link href={href} className="block" aria-label={`${product.name}, ${colorMeta.name}`}>
        <div
          className="relative aspect-square overflow-hidden rounded-[20px] transition-colors duration-700"
          style={{ backgroundColor: colorMeta.tint }}
        >
          {product.badge && <Badge kind={product.badge} className="absolute top-3 left-3 z-10" />}
          <span className="absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full bg-paper/80 text-ink opacity-0 transition-[opacity,transform] duration-500 ease-out-expo group-hover:opacity-100 group-hover:translate-x-0 translate-x-1">
            <ArrowUpRight className="size-4" strokeWidth={2} />
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={variant.sku}
              initial={reduce ? false : { opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04, y: -6 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="absolute inset-0 p-5 transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
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

      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <p className="eyebrow mb-2 text-[11px]">{categoryById[product.category].name}</p>
        <Link href={href} className="block">
          <h3 className="font-display text-[1.35rem] leading-tight text-fg transition-colors group-hover:text-smeg">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-fg-muted">{product.short}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
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
