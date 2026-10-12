import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { colors } from "@/data/colors";
import { filterProducts, getCatalogColors, getRelated, getVariant, productImage } from "@/lib/products";

const categoryIds = new Set(categories.map((c) => c.id));
const colorIds = new Set(colors.map((c) => c.id));

describe("каталог", () => {
  it("содержит не меньше 25 товаров", () => {
    expect(products.length).toBeGreaterThanOrEqual(25);
  });

  it("slug уникальны и в kebab-case", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("у каждого товара валидная категория, цена и хотя бы один вариант", () => {
    for (const p of products) {
      expect(categoryIds.has(p.category), `${p.slug}: категория ${p.category}`).toBe(true);
      expect(p.price, `${p.slug}: цена`).toBeGreaterThan(0);
      if (p.oldPrice) expect(p.oldPrice).toBeGreaterThan(p.price);
      expect(p.variants.length, `${p.slug}: варианты`).toBeGreaterThan(0);
      expect(p.features.length).toBeGreaterThanOrEqual(3);
      expect(p.specs.length).toBeGreaterThanOrEqual(3);
      expect(p.short.length).toBeGreaterThan(10);
      expect(p.description.length).toBeGreaterThan(60);
    }
  });

  it("цвета вариантов существуют и не повторяются внутри товара, артикулы уникальны", () => {
    const allSkus: string[] = [];
    for (const p of products) {
      const seen = new Set<string>();
      for (const v of p.variants) {
        expect(colorIds.has(v.color), `${p.slug}: цвет ${v.color}`).toBe(true);
        expect(seen.has(v.color), `${p.slug}: цвет ${v.color} повторяется`).toBe(false);
        seen.add(v.color);
        allSkus.push(v.sku);
      }
    }
    expect(new Set(allSkus).size).toBe(allSkus.length);
  });

  it("для каждого артикула есть фото в public/products", () => {
    const missing: string[] = [];
    for (const p of products) {
      for (const v of p.variants) {
        const file = path.join(process.cwd(), "public", productImage(v.sku));
        if (!existsSync(file)) missing.push(v.sku);
      }
    }
    expect(missing, `нет фото: ${missing.join(", ")}`).toEqual([]);
  });

  it("в каждой категории есть хотя бы один товар", () => {
    for (const c of categories) {
      expect(filterProducts({ category: c.id }).length, c.id).toBeGreaterThan(0);
    }
  });

  it("на полке бестселлеров от 6 до 10 товаров", () => {
    const featured = products.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThanOrEqual(6);
    expect(featured.length).toBeLessThanOrEqual(10);
  });

  it("предзаказ отмечен у аэрогриля", () => {
    const af = products.find((p) => p.slug === "afc01-dual-flavour");
    expect(af?.badge).toBe("preorder");
  });
});

describe("помощники", () => {
  it("getVariant возвращает нужный цвет или первый", () => {
    const fab = products.find((p) => p.slug === "fab28")!;
    expect(getVariant(fab, "pink").color).toBe("pink");
    expect(getVariant(fab, "olive")).toBe(fab.variants[0]);
    expect(getVariant(fab, null)).toBe(fab.variants[0]);
  });

  it("getRelated не включает сам товар и отдаёт не больше лимита", () => {
    const fab = products.find((p) => p.slug === "fab28")!;
    const related = getRelated(fab, 4);
    expect(related.length).toBe(4);
    expect(related.some((p) => p.slug === "fab28")).toBe(false);
    expect(related[0].category).toBe("fridges");
  });

  it("filterProducts фильтрует по категории и цвету", () => {
    expect(filterProducts({ category: "toasters" }).every((p) => p.category === "toasters")).toBe(true);
    expect(filterProducts({ color: "pink" }).every((p) => p.variants.some((v) => v.color === "pink"))).toBe(true);
    expect(filterProducts({}).length).toBe(products.length);
  });

  it("getCatalogColors содержит пастельно-голубой первым", () => {
    expect(getCatalogColors()[0]).toBe("pastel-blue");
  });
});
