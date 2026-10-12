/**
 * Собирает блок «Technical Features» со страниц товаров smeg.com в scripts/smeg-specs.json.
 *   node scripts/fetch-smeg-specs.mjs FAB28RPB6 TSF01PBEU ...
 */
import fs from "node:fs/promises";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";

function textLines(html) {
  let s = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ");
  s = s.replace(/<[^>]+>/g, "\n");
  s = s
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseSpecs(lines) {
  const start = lines.findIndex((l) => /^Technical Features$/i.test(l));
  if (start < 0) return {};
  const specs = {};
  let key = null;
  for (let i = start + 1; i < Math.min(lines.length, start + 400); i++) {
    const l = lines[i];
    if (/^(Available colours|Compare|Legal warranty|Download|Manuals|Related products|Accessories)$/i.test(l)) break;
    if (/:$/.test(l)) {
      key = l.slice(0, -1).trim();
      continue;
    }
    if (key) {
      specs[key] = specs[key] ? `${specs[key]} / ${l}` : l;
      key = null;
    }
  }
  return specs;
}

async function main() {
  const skus = process.argv.slice(2);
  const out = {};
  for (const sku of skus) {
    try {
      const res = await fetch(`https://www.smeg.com/products/${sku}`, { headers: { "user-agent": UA } });
      const html = await res.text();
      const lines = textLines(html);
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? "";
      const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim() ?? "";
      out[sku] = { title, description, specs: parseSpecs(lines) };
      console.log(`ok ${sku}: ${Object.keys(out[sku].specs).length} specs`);
    } catch (e) {
      console.error(`FAIL ${sku}: ${e.message}`);
    }
  }
  await fs.writeFile("scripts/smeg-specs.json", JSON.stringify(out, null, 2));
}

main();
