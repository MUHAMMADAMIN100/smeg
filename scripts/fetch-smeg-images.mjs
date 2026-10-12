/**
 * Скачивает официальные фото товаров со smeg.com по артикулам (SKU).
 *
 *   node scripts/fetch-smeg-images.mjs FAB28RPB6 TSF01PBEU ...
 *   node scripts/fetch-smeg-images.mjs --list scripts/skus.txt
 *
 * Для каждого артикула берётся страница /products/<SKU>, из неё — подписанная
 * ссылка на главное фото, фото сжимается до 1400 px и сохраняется в
 * public/products/<sku>.jpg. Заголовок и описание со страницы складываются в
 * scripts/smeg-meta.json для справки при наполнении каталога.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const OUT_DIR = path.resolve("public/products");
const META_PATH = path.resolve("scripts/smeg-meta.json");
const CONCURRENCY = 4;

async function readSkus() {
  const args = process.argv.slice(2);
  const listIdx = args.indexOf("--list");
  if (listIdx >= 0) {
    const text = await fs.readFile(args[listIdx + 1], "utf8");
    return text
      .split(/\s+/)
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("#"));
  }
  return args;
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "image/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for image ${url.slice(0, 80)}`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error(`Not an image (${type}) ${url.slice(0, 80)}`);
  return Buffer.from(await res.arrayBuffer());
}

function extractSigned(html, sku, suffix = "") {
  const needle = `https://assets.4flow.cloud/${sku}${suffix}.jpg?pEFs=`;
  const i = html.indexOf(needle);
  if (i < 0) return null;
  let j = i;
  const stop = new Set(['"', "'", " ", "<", ")", "\n"]);
  while (j < html.length && !stop.has(html[j])) j++;
  return html.slice(i, j).replace(/&amp;/g, "&");
}

function extractMeta(html) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? "";
  const description =
    html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim() ?? "";
  return { title, description };
}

async function processSku(sku, meta) {
  const target = path.join(OUT_DIR, `${sku.toLowerCase()}.jpg`);
  try {
    await fs.access(target);
    console.log(`skip  ${sku} (exists)`);
    return;
  } catch {
    // not downloaded yet
  }
  const html = await fetchText(`https://www.smeg.com/products/${sku}`);
  const url = extractSigned(html, sku);
  if (!url) throw new Error(`no main image on page for ${sku}`);
  const buf = await fetchBuffer(url);
  const image = sharp(buf);
  const info = await image.metadata();
  const out = await image
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();
  await fs.writeFile(target, out);
  const m = extractMeta(html);
  meta[sku] = { ...m, sourceWidth: info.width, sourceHeight: info.height, bytes: out.length };
  console.log(`ok    ${sku} ${info.width}x${info.height} -> ${(out.length / 1024).toFixed(0)} KB | ${m.title}`);
}

async function main() {
  const skus = await readSkus();
  if (!skus.length) {
    console.error("Укажите артикулы или --list файл");
    process.exit(1);
  }
  await fs.mkdir(OUT_DIR, { recursive: true });
  let meta = {};
  try {
    meta = JSON.parse(await fs.readFile(META_PATH, "utf8"));
  } catch {
    meta = {};
  }
  const failed = [];
  let cursor = 0;
  async function worker() {
    while (cursor < skus.length) {
      const sku = skus[cursor++];
      try {
        await processSku(sku, meta);
      } catch (err) {
        failed.push(sku);
        console.error(`FAIL  ${sku}: ${err.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await fs.writeFile(META_PATH, JSON.stringify(meta, null, 2));
  console.log(`\nГотово. Ошибок: ${failed.length}${failed.length ? " -> " + failed.join(", ") : ""}`);
  if (failed.length) process.exitCode = 2;
}

main();
