/**
 * Делает прозрачные вырезки товаров из студийных фото на белом фоне.
 *   node scripts/cutout.mjs EGF03CREU FAB28RPB6 ...
 * Фон удаляется заливкой от краёв (белое, связанное с рамкой), поэтому белые детали
 * внутри товара остаются. Результат: public/cutouts/<sku>.webp с альфа-каналом.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IN = path.resolve("public/products");
const OUT = path.resolve("public/cutouts");
const WHITE = 236; // всё светлее — фон
const SOFT = 212; // полупрозрачная кромка между SOFT и 255

async function cutout(sku) {
  const src = path.join(IN, `${sku.toLowerCase()}.jpg`);
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const bg = new Uint8Array(w * h);
  const lum = (i) => Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const stack = [];
  const push = (x, y) => {
    const i = y * w + x;
    if (bg[i] || lum(i) < WHITE) return;
    bg[i] = 1;
    stack.push(i);
  };
  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }
  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i - x) / w;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }
  // Прозрачный фон и мягкая кромка.
  for (let i = 0; i < w * h; i++) {
    if (bg[i]) {
      data[i * 4 + 3] = 0;
      continue;
    }
    const x = i % w;
    const y = (i - x) / w;
    const nearBg =
      (x > 0 && bg[i - 1]) || (x < w - 1 && bg[i + 1]) || (y > 0 && bg[i - w]) || (y < h - 1 && bg[i + w]);
    if (nearBg) {
      const l = lum(i);
      if (l > SOFT) data[i * 4 + 3] = Math.round(((255 - l) / (255 - SOFT)) * 255);
    }
  }
  // Обрезаем по содержимому с небольшим полем.
  const out = await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 1 })
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 90 })
    .toBuffer();
  await fs.writeFile(path.join(OUT, `${sku.toLowerCase()}.webp`), out);
  console.log(`ok ${sku} -> ${(out.length / 1024).toFixed(0)} KB`);
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  for (const sku of process.argv.slice(2)) {
    try {
      await cutout(sku);
    } catch (e) {
      console.error(`FAIL ${sku}: ${e.message}`);
    }
  }
}

main();
