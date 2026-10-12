import { expect, test } from "@playwright/test";
import { collectErrors, expectNoHorizontalScroll, scrollThrough } from "./helpers";

test.describe("Страница товара", () => {
  test("открывает FAB28 в розовом, меняет цвет и обновляет ссылки", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/catalog/fab28?color=pink");
    await expect(page).toHaveTitle(/Холодильник FAB28/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Холодильник FAB28");
    await expect(page.getByText("Цвет:")).toContainText("Розовый");
    await expect(page.locator('img[alt="Холодильник FAB28 в цвете Розовый"]').first()).toBeVisible();

    const wa = page.getByRole("link", { name: /Заказать в WhatsApp/ });
    let href = decodeURIComponent((await wa.getAttribute("href")) ?? "");
    expect(href).toContain("Холодильник FAB28");
    expect(href).toContain("FAB28RPK6");
    expect(href).toContain("Розовый");

    await page.getByRole("radio", { name: "Жёлтый" }).click();
    await expect(page).toHaveURL(/color=yellow/);
    await expect(page.locator('img[alt="Холодильник FAB28 в цвете Жёлтый"]').first()).toBeVisible();
    href = decodeURIComponent((await wa.getAttribute("href")) ?? "");
    expect(href).toContain("FAB28RYW6");

    await expect(page.getByText("Характеристики")).toBeVisible();
    await expect(page.getByText("270 л", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Смотрите также" })).toBeVisible();
    await expect(page.locator("article")).toHaveCount(4);

    await scrollThrough(page);
    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });

  test("предзаказ показывает бейдж и кнопку бронирования", async ({ page }) => {
    await page.goto("/catalog/afc01-dual-flavour");
    await expect(page.getByText("Предзаказ").first()).toBeVisible();
    await expect(page.getByRole("link", { name: /Забронировать в WhatsApp/ })).toBeVisible();
  });

  test("хлебные крошки ведут в категорию", async ({ page }) => {
    await page.goto("/catalog/tsf01");
    await page.getByRole("navigation", { name: "Хлебные крошки" }).getByRole("link", { name: "Тостеры" }).click();
    await expect(page).toHaveURL(/category=toasters/);
  });

  test("несуществующий товар отдаёт 404", async ({ page }) => {
    const response = await page.goto("/catalog/no-such-product");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await page.getByRole("link", { name: "В каталог" }).click();
    await expect(page).toHaveURL(/\/catalog$/);
  });
});
