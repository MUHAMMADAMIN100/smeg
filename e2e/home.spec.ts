import { expect, test } from "@playwright/test";
import { collectErrors, expectNoHorizontalScroll, scrollThrough } from "./helpers";

test.describe("Главная", () => {
  test("загружается без ошибок, показывает hero и все секции", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await expect(page).toHaveTitle(/SMEG Tajikistan/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Техника");

    for (const id of ["categories", "colors", "bestsellers", "about", "reviews", "services", "contacts"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }

    await scrollThrough(page);
    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });

  test("ссылки заказа ведут в WhatsApp и Telegram с текстом", async ({ page }) => {
    await page.goto("/");
    const wa = page.locator('a[href^="https://wa.me/"]').first();
    await expect(wa).toHaveAttribute("href", /wa\.me\/\d+\?text=/);
    await expect(wa).toHaveAttribute("target", "_blank");
    await expect(wa).toHaveAttribute("rel", /noopener/);
    const tg = page.locator('a[href^="https://t.me/"]').first();
    await expect(tg).toHaveAttribute("href", /t\.me\/\w+\?text=/);
    const href = await wa.getAttribute("href");
    expect(decodeURIComponent(href ?? "")).toContain("Здравствуйте");
  });

  test("переключатель темы меняет тему и запоминает её", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
    const toggle = page.getByRole("button", { name: /тёмную тему/i });
    await toggle.click();
    await expect(html).toHaveClass(/dark/);
    await page.reload();
    await expect(html).toHaveClass(/dark/);
    await page.getByRole("button", { name: /светлую тему/i }).click();
    await expect(html).not.toHaveClass(/dark/);
  });

  test("цветовая студия меняет холодильник и ссылку заказа", async ({ page }) => {
    await page.goto("/#colors");
    const studio = page.locator("#colors");
    await studio.scrollIntoViewIfNeeded();
    const image = studio.locator('img[alt^="Холодильник FAB28 в цвете"]').first();
    await expect(image).toBeVisible();
    const before = await image.getAttribute("src");

    await studio.getByRole("button", { name: /Розовый/ }).first().click();
    await expect(studio.locator('img[alt="Холодильник FAB28 в цвете Розовый"]').first()).toBeVisible();
    const after = await studio.locator('img[alt="Холодильник FAB28 в цвете Розовый"]').first().getAttribute("src");
    expect(after).not.toBe(before);
    expect(after).toContain("fab28rpk6");

    const order = studio.getByRole("link", { name: /Заказать в этом цвете/ });
    const href = decodeURIComponent((await order.getAttribute("href")) ?? "");
    expect(href).toContain("FAB28RPK6");
    expect(href).toContain("Розовый");

    const more = studio.getByRole("link", { name: /Страница товара/ });
    await expect(more).toHaveAttribute("href", "/catalog/fab28?color=pink");
  });

  test("категории ведут в каталог с фильтром", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('#categories a[href="/catalog?category=kettles"]');
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(page).toHaveURL(/\/catalog\?category=kettles/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Чайники");
  });

  test("FAQ раскрывается и сворачивается", async ({ page }) => {
    await page.goto("/#services");
    const first = page.getByRole("button", { name: "Техника оригинальная?" });
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    const second = page.getByRole("button", { name: "Сколько ждать доставку?" });
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText(/Если модель есть на складе/)).toBeVisible();
  });

  test("предзаказ: смена цвета аэрогриля меняет ссылку бронирования", async ({ page }) => {
    await page.goto("/");
    const promo = page.locator("section", { has: page.getByRole("heading", { name: /Dual Flavour/ }) }).first();
    await promo.scrollIntoViewIfNeeded();
    await promo.getByRole("radio", { name: "Изумрудный" }).click();
    const link = promo.getByRole("link", { name: /Забронировать/ });
    const href = decodeURIComponent((await link.getAttribute("href")) ?? "");
    expect(href).toContain("забронировать");
    expect(href).toContain("AFC01EGMEU");
  });
});
