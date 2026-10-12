import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";

export type OrderRequest = {
  productName: string;
  model: string;
  colorName?: string;
  price?: number;
  /** Абсолютный адрес страницы товара, добавляется в конец сообщения. */
  url?: string;
  /** «Заказать» или «Забронировать» для предзаказа. */
  intent?: "order" | "preorder";
};

/** Текст сообщения для мессенджера на русском языке. */
export function buildOrderMessage(req: OrderRequest): string {
  const verb = req.intent === "preorder" ? "забронировать" : "заказать";
  const lines = [`Здравствуйте! Хочу ${verb} ${req.productName} (${req.model})`];
  if (req.colorName) lines[0] += ` в цвете «${req.colorName}»`;
  lines[0] += ".";
  if (req.price) lines.push(`Цена на сайте: ${formatPrice(req.price)}.`);
  if (req.url) lines.push(req.url);
  return lines.join("\n");
}

/** Общее сообщение без товара, для кнопок «Связаться». */
export function buildContactMessage(): string {
  return "Здравствуйте! Хочу узнать подробнее о технике SMEG.";
}

export function whatsappLink(message: string): string {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telegramLink(message: string): string {
  return `https://t.me/${site.telegram}?text=${encodeURIComponent(message)}`;
}

export function phoneLink(): string {
  return `tel:${site.phoneE164}`;
}

export type OrderLinks = {
  whatsapp: string;
  telegram: string;
  phone: string;
  message: string;
};

/** Все ссылки заказа для товара, чтобы кнопки на странице были согласованы. */
export function orderLinks(req: OrderRequest): OrderLinks {
  const message = buildOrderMessage(req);
  return {
    whatsapp: whatsappLink(message),
    telegram: telegramLink(message),
    phone: phoneLink(),
    message,
  };
}

export function contactLinks(): OrderLinks {
  const message = buildContactMessage();
  return {
    whatsapp: whatsappLink(message),
    telegram: telegramLink(message),
    phone: phoneLink(),
    message,
  };
}
