import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { productImage } from "@/lib/products";

/** Все файлы .tsx/.ts в папке. */
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx?|mts)$/.test(name)) out.push(full);
  }
  return out;
}

describe("артикулы в компонентах", () => {
  it("каждый артикул, упомянутый в коде, имеет фото в public/products", () => {
    // Каталог проверяется в data.test.ts, здесь только артикулы, зашитые в компоненты.
    const files = walk(path.join(process.cwd(), "src/components"));
    const missing: string[] = [];
    for (const file of files) {
      const text = readFileSync(file, "utf8");
      // Артикулы SMEG не короче 7 знаков, например "TR90IPP" или "TSF01PBEU"; "FAB28" — это модель, не артикул.
      for (const m of text.matchAll(/"([A-Z]{2,5}\d{1,4}[A-Z0-9]{0,6})"/g)) {
        const sku = m[1];
        if (!/\d/.test(sku) || sku.length < 7) continue;
        const target = path.join(process.cwd(), "public", productImage(sku));
        if (!existsSync(target)) missing.push(`${path.relative(process.cwd(), file)} → ${sku}`);
      }
    }
    expect(missing, `нет фото для: ${missing.join(", ")}`).toEqual([]);
  });
});
