import { expect, test } from "@playwright/test";
import { collectErrors, expectNoHorizontalScroll } from "./helpers";

test.describe("Каталог", () => {
  test("показывает все товары и фильтрует по категории и цвету", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/catalog");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Вся техника");
    await expect(page.getByText(/28 товаров/)).toBeVisible();
    await expect(page.locator("article")).toHaveCount(28);

    await page.getByRole("button", { name: /^Тостеры/ }).click();
    await expect(page).toHaveURL(/category=toasters/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Тостеры");
    await expect(page.locator("article")).toHaveCount(3);

    await page.getByRole("button", { name: "Розовый", exact: true }).click();
    await expect(page).toHaveURL(/color=pink/);
    await expect(page.locator("article")).toHaveCount(3);
    await expect(page.locator('article img[alt*="Розовый"]').first()).toBeVisible();

    await page.getByRole("button", { name: /Сбросить/ }).click();
    await expect(page).toHaveURL(/\/catalog$/);
    await expect(page.locator("article")).toHaveCount(28);
    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });

  test("пустой результат показывает подсказку и сброс", async ({ page }) => {
    await page.goto("/catalog?category=airfryers&color=pink");
    await expect(page.getByText("Ничего не нашли")).toBeVisible();
    await page.getByRole("button", { name: "Сбросить фильтры" }).click();
    await expect(page.locator("article")).toHaveCount(28);
  });

  test("неизвестные параметры игнорируются", async ({ page }) => {
    await page.goto("/catalog?category=nope&color=neon");
    await expect(page.locator("article")).toHaveCount(28);
  });

  test("карточка ведёт на страницу товара с выбранным цветом", async ({ page }) => {
    await page.goto("/catalog?category=kettles");
    const card = page.locator("article", { hasText: "Чайник KLF03" });
    await card.getByRole("radio", { name: "Красный" }).click();
    await card.getByRole("link", { name: /Чайник KLF03, Красный/ }).click();
    await expect(page).toHaveURL(/\/catalog\/klf03\?color=red/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Чайник KLF03");
    await expect(page.getByText("Цвет:")).toContainText("Красный");
  });
});
