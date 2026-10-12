import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, scrollThrough } from "./helpers";

test.describe("Мобильная версия", () => {
  test.skip(({ isMobile }) => !isMobile, "только для мобильного проекта");

  test("бургер-меню открывается, ссылки работают, прокрутка блокируется", async ({ page }) => {
    await page.goto("/");
    const burger = page.getByRole("button", { name: "Открыть меню" });
    await burger.click();
    const menu = page.getByRole("dialog", { name: "Меню" });
    await expect(menu).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await menu.getByRole("link", { name: "Каталог" }).click();
    await expect(page).toHaveURL(/\/catalog$/);
    await expect(menu).toBeHidden();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("главная, каталог и товар без горизонтальной прокрутки", async ({ page }) => {
    for (const url of ["/", "/catalog", "/catalog/fab28"]) {
      await page.goto(url);
      await scrollThrough(page);
      await expectNoHorizontalScroll(page);
    }
  });

  test("на ширине 320 px тоже ничего не вылезает", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    for (const url of ["/", "/catalog?category=fridges", "/catalog/portofino-cpf9"]) {
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
