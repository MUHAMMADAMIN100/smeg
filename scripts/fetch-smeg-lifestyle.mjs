/**
 * Скачивает lifestyle-баннеры со smeg.com в public/lifestyle/<name>.jpg.
 *   node scripts/fetch-smeg-lifestyle.mjs
 * Для каждого имени перебираются кандидаты: прямой путь в галерее или страница,
 * на которой ищется первый подходящий баннер.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const BASE = "https://www.smeg.com/binaries/content/gallery/";
const VARIANTS = ["brx:doubleDeskLarge", "", "brx:squareDeskLarge", "brx:postcardDeskLarge", "brx:squareMobile"];
const OUT = path.resolve("public/lifestyle");

/** name → список источников: строка = путь в галерее, объект = страница + regex. */
const SOURCES = {
  "hero-50s": [
    { page: "/aesthetic/50-s-retro-style", match: /herobanner|hero-banner|keyvisual|_kv_|1920x/i },
    "smeg/aesthetic/smeg-refrigerator-50s-style-aesthetic-line.jpg/smeg-refrigerator-50s-style-aesthetic-line.jpg",
  ],
  "hero-portofino": [
    { page: "/aesthetic/portofino", match: /herobanner|hero-banner|keyvisual|_kv_|1920x/i },
    "smeg/aesthetic/smeg-cooker-portofino-aesthetic.gif/smeg-cooker-portofino-aesthetic.gif",
  ],
  "hero-victoria": [
    { page: "/aesthetic/victoria", match: /herobanner|hero-banner|keyvisual|_kv_|1920x/i },
    "smeg/aesthetic/smeg-cooker-victoria-aesthetic-line/smeg-cooker-victoria-aesthetic-line",
  ],
  "hero-coffee": ["smeg/house-of-coffee/hoc03_egf03-ecf03-dcf02_kv-1.jpg/hoc03_egf03-ecf03-dcf02_kv-1.jpg"],
  "hero-airfryer": [
    "smeg/categories/afc01_wall_1024x1024_1.jpg/afc01_wall_1024x1024_1.jpg",
    "smeg/categories/air-fryer/air-fryer_acf01sbmeu_window_960x690.jpg/air-fryer_acf01sbmeu_window_960x690.jpg",
  ],
  "moonlight": ["smeg/matt-project/moonlight/dcf-fab-1920_580-a.png/dcf-fab-1920_580-a.png"],
  "moonlight-fab": ["smeg/matt-project/moonlight/fab_moonlight_kv_1024_1024.png/fab_moonlight_kv_1024_1024.png"],
  "line-50s": ["smeg/aesthetic/smeg-refrigerator-50s-style-aesthetic-line.jpg/smeg-refrigerator-50s-style-aesthetic-line.jpg"],
  "line-victoria": ["smeg/aesthetic/smeg-cooker-victoria-aesthetic-line/smeg-cooker-victoria-aesthetic-line"],
  "line-portofino": [
    { page: "/aesthetic/portofino", match: /portofino.*(jpg|png)/i },
    "smeg/categories/card_ged_1300x1300px_cookers_01.jpg/card_ged_1300x1300px_cookers_01.jpg",
  ],
  "airfryer-black": ["smeg/categories/air-fryer/blackmatt_013_1024x1024.jpg/blackmatt_013_1024x1024.jpg"],
  "airfryer-emerald": ["smeg/categories/air-fryer/emeraldgreen_021_1024x1024.jpg/emeraldgreen_021_1024x1024.jpg"],
  "airfryer-crispy": ["smeg/categories/air-fryer/air-fryer_acf01blmeu_crispy_juicy_960x690.jpg/air-fryer_acf01blmeu_crispy_juicy_960x690.jpg"],
  "mixer-smf05": ["smeg/content-elements/visual-boxes/smf/web_smf05pkeu_8.jpg.jpg/web_smf05pkeu_8.jpg.jpg"],
  "coffee-bcc": ["smeg-mexico/bcc03blmeu_l01.jpg/bcc03blmeu_l01.jpg"],
  "coffee-egf03": ["smeg/categories/sda-coffee-machine/egf03rdeu_l04-1-960x690.jpg/egf03rdeu_l04-1-960x690.jpg"],
  "kettle-klf03": ["smeg/content-elements/visual-boxes/kettle_klf03_smeg.jpg/kettle_klf03_smeg.jpg"],
  "toaster-tsf01": ["smeg/content-elements/visual-boxes/postcarddesklarge_awards_tsf01.jpg/postcarddesklarge_awards_tsf01.jpg"],
  "blender-blf03": ["smeg/content-elements/visual-boxes/blf03creu_l01_960x690.jpg/blf03creu_l01_960x690.jpg"],
  "espresso": ["smeg/categories/sda_smeg_espresso_coffee_machine_3-4.jpg/sda_smeg_espresso_coffee_machine_3-4.jpg"],
  "standmixer": ["smeg/categories/sda_smeg_standmixer.jpg/sda_smeg_standmixer.jpg"],
  "drip": ["smeg/categories/sda_smeg_drip_coffee.jpg/sda_smeg_drip_coffee.jpg"],
};

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function fromGallery(rel) {
  for (const v of VARIANTS) {
    const url = BASE + rel + (v ? "/" + v : "");
    const buf = await fetchBuffer(url);
    if (buf) {
      const meta = await sharp(buf).metadata();
      if ((meta.width ?? 0) >= 700) return { buf, url };
    }
  }
  return null;
}

async function fromPage(src) {
  const res = await fetch("https://www.smeg.com" + src.page, { headers: { "user-agent": UA } });
  if (!res.ok) return null;
  const html = await res.text();
  const urls = [...html.matchAll(/https:\/\/www\.smeg\.com\/binaries\/content\/gallery\/[^"'\s]+/g)].map((m) => m[0]);
  const cleaned = [...new Set(urls.map((u) => u.replace(/\/brx[:%][A-Za-z0-9]+$/, "")))];
  const hit = cleaned.filter((u) => src.match.test(u) && !/logo|icon/i.test(u));
  for (const u of hit) {
    const r = await fromGallery(u.replace(BASE, ""));
    if (r) return r;
  }
  return null;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  for (const [name, sources] of Object.entries(SOURCES)) {
    const target = path.join(OUT, `${name}.jpg`);
    try {
      await fs.access(target);
      console.log(`skip ${name}`);
      continue;
    } catch {
      // качаем
    }
    let got = null;
    for (const src of sources) {
      got = typeof src === "string" ? await fromGallery(src) : await fromPage(src);
      if (got) break;
    }
    if (!got) {
      console.error(`FAIL ${name}`);
      continue;
    }
    const img = sharp(got.buf, { animated: false });
    const meta = await img.metadata();
    const out = await img
      .flatten({ background: "#ffffff" })
      .resize({ width: 1920, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
    await fs.writeFile(target, out);
    console.log(`ok   ${name} ${meta.width}x${meta.height} ${(out.length / 1024).toFixed(0)} KB  <- ${got.url.slice(BASE.length, BASE.length + 70)}`);
  }
}

main();
