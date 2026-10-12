import { products } from "@/data/products";
import { categories, type CategoryId } from "@/data/categories";
import { colors, type ColorId } from "@/data/colors";
import type { Product, Variant } from "@/data/types";

/** Путь к фото варианта. Файлы лежат в public/products/<sku>.jpg. */
export function productImage(sku: string): string {
  return `/products/${sku.toLowerCase()}.jpg`;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getProductsByCategory(category: CategoryId): Product[] {
  return products.filter((p) => p.category === category);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured);
}

/** Вариант по цвету или первый доступный. */
export function getVariant(product: Product, color?: ColorId | null): Variant {
  return product.variants.find((v) => v.color === color) ?? product.variants[0];
}

/** Похожие товары: сначала из той же категории, затем остальные бестселлеры. */
export function getRelated(product: Product, limit = 4): Product[] {
  const same = products.filter((p) => p.category === product.category && p.slug !== product.slug);
  const others = products.filter((p) => p.category !== product.category && p.featured);
  return [...same, ...others].slice(0, limit);
}

/** Цвета, которые реально есть в каталоге, в порядке фирменной палитры. */
export function getCatalogColors(): ColorId[] {
  const present = new Set(products.flatMap((p) => p.variants.map((v) => v.color)));
  return colors.map((c) => c.id).filter((id) => present.has(id));
}

/** Категории с количеством товаров, для фильтров. */
export function getCategoryCounts(): Record<CategoryId, number> {
  const counts = Object.fromEntries(categories.map((c) => [c.id, 0])) as Record<CategoryId, number>;
  for (const p of products) counts[p.category] += 1;
  return counts;
}

export type CatalogFilter = { category?: CategoryId | null; color?: ColorId | null };

export function filterProducts(filter: CatalogFilter): Product[] {
  return products.filter((p) => {
    if (filter.category && p.category !== filter.category) return false;
    if (filter.color && !p.variants.some((v) => v.color === filter.color)) return false;
    return true;
  });
}
