import { test } from "@playwright/test";
import { scrollThrough } from "./helpers";

/** Скриншоты для визуальной проверки, не сравнение. */
test.describe("Скриншоты", () => {
  test.setTimeout(240_000);
  test("главная, каталог, товар, цвета и контакты", async ({ page }, testInfo) => {
    const tag = testInfo.project.name;
    const pages: [string, string][] = [
      ["/", "home"],
      ["/catalog", "catalog"],
      ["/catalog/fab28?color=mint", "product"],
      ["/colors", "colors"],
      ["/contacts", "contacts"],
    ];
    for (const [url, name] of pages) {
      await page.goto(url);
      await scrollThrough(page);
      await page.waitForTimeout(600);
      await page.screenshot({ path: `e2e/shots/${tag}-${name}.png`, fullPage: true });
    }
  });
});
