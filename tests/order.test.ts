import { describe, expect, it } from "vitest";
import { site } from "@/data/site";
import {
  buildOrderMessage,
  contactLinks,
  orderLinks,
  telegramLink,
  whatsappLink,
} from "@/lib/order";

describe("buildOrderMessage", () => {
  it("собирает сообщение с товаром, цветом, ценой и ссылкой", () => {
    const text = buildOrderMessage({
      productName: "Холодильник FAB28",
      model: "FAB28RPB6",
      colorName: "Пастельно-голубой",
      price: 18900,
      url: "https://example.com/catalog/fab28",
    });
    expect(text).toContain("Хочу заказать Холодильник FAB28 (FAB28RPB6) в цвете «Пастельно-голубой».");
    expect(text).toContain("Цена на сайте: 18 900 TJS.");
    expect(text.endsWith("https://example.com/catalog/fab28")).toBe(true);
  });

  it("для предзаказа пишет «забронировать» и не требует цвета", () => {
    const text = buildOrderMessage({
      productName: "Аэрогриль Dual Flavour",
      model: "AFC01",
      intent: "preorder",
    });
    expect(text).toBe("Здравствуйте! Хочу забронировать Аэрогриль Dual Flavour (AFC01).");
  });
});

describe("messenger links", () => {
  it("whatsapp ведёт на wa.me с номером и закодированным текстом", () => {
    const link = whatsappLink("Привет, мир");
    expect(link.startsWith(`https://wa.me/${site.whatsapp}?text=`)).toBe(true);
    expect(link).toContain(encodeURIComponent("Привет, мир"));
    expect(link).not.toContain(" ");
  });

  it("telegram ведёт на t.me с именем пользователя", () => {
    expect(telegramLink("hi")).toBe(`https://t.me/${site.telegram}?text=hi`);
  });

  it("orderLinks возвращает согласованный набор ссылок", () => {
    const links = orderLinks({ productName: "Тостер", model: "TSF01" });
    expect(links.phone).toBe(`tel:${site.phoneE164}`);
    expect(links.whatsapp).toContain(encodeURIComponent(links.message));
    expect(links.telegram).toContain(encodeURIComponent(links.message));
  });

  it("contactLinks даёт общий текст без товара", () => {
    const links = contactLinks();
    expect(links.message).toContain("SMEG");
    expect(links.whatsapp).toContain("wa.me");
  });
});
