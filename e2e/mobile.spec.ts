import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, scrollThrough } from "./helpers";

test.describe("Мобильная версия", () => {
  test.skip(({ isMobile }) => !isMobile, "только для мобильного проекта");

  test("боковое меню открывается, категории раскрываются, прокрутка блокируется", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Открыть меню" }).click();
    const menu = page.getByRole("dialog", { name: "Меню" });
    await expect(menu).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await menu.getByRole("button", { name: "Малая техника" }).click();
    await expect(menu.getByRole("link", { name: "Тостеры" })).toBeVisible();
    await menu.getByRole("link", { name: "Цвета" }).click();
    await expect(page).toHaveURL(/\/colors$/);
    await expect(menu).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("главная, каталог, товар, цвета и контакты без горизонтальной прокрутки", async ({ page }) => {
    for (const url of ["/", "/catalog", "/catalog/fab28", "/colors", "/contacts"]) {
      await page.goto(url);
      await scrollThrough(page);
      await expectNoHorizontalScroll(page);
    }
  });

  test("на ширине 320 px тоже ничего не вылезает", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    for (const url of ["/", "/catalog?category=fridges", "/catalog/portofino-cpf9", "/colors"]) {
      await page.goto(url);
      await scrollThrough(page);
      await expectNoHorizontalScroll(page);
    }
  });

  test("кнопки заказа крупнее 44 px", async ({ page }) => {
    await page.goto("/catalog/klf03");
    const box = await page.getByRole("link", { name: /Заказать в WhatsApp/ }).boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });
});
