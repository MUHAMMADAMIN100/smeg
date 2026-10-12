import { test } from "@playwright/test";
import { scrollThrough } from "./helpers";

/** Скриншоты для визуальной проверки, не сравнение. */
test.describe("Скриншоты", () => {
  test.setTimeout(240_000);
  test("главная, каталог и товар в обеих темах", async ({ page }, testInfo) => {
    const tag = testInfo.project.name;
    for (const theme of ["light", "dark"] as const) {
      await page.goto("/");
      await page.evaluate((t) => {
        localStorage.setItem("smeg-theme", t);
      }, theme);
      await page.reload();
      await scrollThrough(page);
      await page.waitForTimeout(800);
      await page.screenshot({ path: `e2e/shots/${tag}-home-${theme}.png`, fullPage: true });

      await page.goto("/catalog");
      await scrollThrough(page);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `e2e/shots/${tag}-catalog-${theme}.png`, fullPage: true });

      await page.goto("/catalog/fab28?color=mint");
      await scrollThrough(page);
      await page.waitForTimeout(500);
      await page.screenshot({ path: `e2e/shots/${tag}-product-${theme}.png`, fullPage: true });
    }
  });
});
