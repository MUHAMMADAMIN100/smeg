import { expect, type Page } from "@playwright/test";

/** Собирает ошибки консоли и необработанные исключения страницы. */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    // Карта OSM в iframe может ругаться на сторонние ресурсы, это не наша ошибка.
    if (text.includes("openstreetmap")) return;
    errors.push(`console: ${text}`);
  });
  return errors;
}

/** Страница не должна прокручиваться по горизонтали. */
export async function expectNoHorizontalScroll(page: Page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth, "горизонтальная прокрутка").toBeLessThanOrEqual(clientWidth + 1);
}

/** Прокручивает страницу до низа, чтобы сработали появления по скроллу. */
export async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    const step = Math.max(400, window.innerHeight * 0.8);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    window.scrollTo(0, 0);
  });
}
