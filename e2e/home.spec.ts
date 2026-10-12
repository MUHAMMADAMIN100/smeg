import { expect, test } from "@playwright/test";
import { collectErrors, expectNoHorizontalScroll, scrollThrough } from "./helpers";

test.describe("Главная", () => {
  test("загружается без ошибок, слайдер листается, все секции на месте", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await expect(page).toHaveTitle(/SMEG Tajikistan/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("SMEG");

    for (const id of ["new", "lines", "popular", "about"]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }

    const carousel = page.getByRole("region", { name: "Главные предложения" });
    const first = await carousel.getByRole("heading", { level: 2 }).textContent();
    await page.getByRole("button", { name: "Следующий слайд" }).click();
    await expect(carousel.getByRole("heading", { level: 2 })).not.toHaveText(first ?? "");
    await page.getByRole("tab", { name: /Слайд 1/ }).click();
    await expect(carousel.getByRole("heading", { level: 2 })).toHaveText(first ?? "");

    await scrollThrough(page);
    await expectNoHorizontalScroll(page);
    expect(errors).toEqual([]);
  });

  test("ссылки заказа в подвале ведут в WhatsApp и Telegram", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    const wa = footer.locator('a[href^="https://wa.me/"]').first();
    await expect(wa).toHaveAttribute("href", /wa\.me\/\d+\?text=/);
    await expect(wa).toHaveAttribute("target", "_blank");
    await expect(wa).toHaveAttribute("rel", /noopener/);
    await expect(footer.locator('a[href^="https://t.me/"]').first()).toHaveAttribute("href", /t\.me\/\w+\?text=/);
  });

  test("мега-меню открывает категории крупной техники", async ({ page, isMobile }) => {
    test.skip(isMobile, "на телефоне вместо мега-меню боковое меню");
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Крупная техника" });
    await trigger.hover();
    const panel = page.locator("#mega-major");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: /Холодильники/ })).toBeVisible();
    await expect(panel.getByRole("link", { name: /Плиты/ })).toBeVisible();
    await panel.getByRole("link", { name: /Холодильники/ }).click();
    await expect(page).toHaveURL(/category=fridges/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Холодильники");
  });

  test("поиск находит товар по модели", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Поиск" }).first().click();
    const dialog = page.getByRole("dialog", { name: "Поиск по каталогу" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("searchbox", { name: "Поисковый запрос" }).fill("klf03");
    const hit = dialog.getByRole("link", { name: /Чайник KLF03/ });
    await expect(hit).toBeVisible();
    await hit.click();
    await expect(page).toHaveURL(/\/catalog\/klf03/);
    await expect(dialog).toBeHidden();
  });

  test("блок «Малая техника» ведёт в каталог группы", async ({ page }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /Малая техника/ }).first();
    await link.scrollIntoViewIfNeeded();
    await link.click();
    await expect(page).toHaveURL(/group=small/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Малая техника");
    await expect(page.locator("article")).toHaveCount(17);
  });
});

test.describe("Цвета", () => {
  test("смена цвета меняет холодильник и ссылку заказа", async ({ page }) => {
    await page.goto("/colors");
    await expect(page.locator('img[alt^="Холодильник FAB28 в цвете"]').first()).toBeVisible();
    await page.getByRole("button", { name: /Розовый/ }).first().click();
    const img = page.locator('img[alt="Холодильник FAB28 в цвете Розовый"]').first();
    await expect(img).toBeVisible();
    expect(await img.getAttribute("src")).toContain("fab28rpk6");
    const order = page.getByRole("link", { name: /Заказать в этом цвете/ });
    const href = decodeURIComponent((await order.getAttribute("href")) ?? "");
    expect(href).toContain("FAB28RPK6");
    expect(href).toContain("Розовый");
    await expect(page.getByRole("link", { name: /Страница товара/ })).toHaveAttribute("href", "/catalog/fab28?color=pink");
  });
});

test.describe("Контакты", () => {
  test("показывает адрес, карту и FAQ", async ({ page }) => {
    await page.goto("/contacts");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("вживую");
    await expect(page.locator('iframe[title^="Карта"]')).toBeAttached();
    const first = page.getByRole("button", { name: "Техника оригинальная?" });
    await first.scrollIntoViewIfNeeded();
    await expect(first).toHaveAttribute("aria-expanded", "true");
    const second = page.getByRole("button", { name: "Сколько ждать доставку?" });
    await second.click();
    await expect(second).toHaveAttribute("aria-expanded", "true");
    await expect(first).toHaveAttribute("aria-expanded", "false");
  });
});
