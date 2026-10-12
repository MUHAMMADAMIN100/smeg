/**
 * Контакты и реквизиты магазина.
 * ЗАГЛУШКИ: замените телефон, WhatsApp, Telegram и адрес на реальные.
 */
export const site = {
  name: "SMEG Tajikistan",
  legalName: "Официальный партнёр SMEG в Таджикистане",
  url: "https://smeg-tajikistan.vercel.app",
  tagline: "Итальянская премиальная техника",
  city: "Истаравшан",
  address: "г. Истаравшан, ул. Исмоили Сомони, 12",
  hours: "09:00–21:00, ежедневно",
  hoursShort: "09:00–21:00",
  // Телефон в международном формате без пробелов для ссылок.
  phoneE164: "+992900000000",
  phoneDisplay: "+992 90 000-00-00",
  // Номер WhatsApp без «+» и пробелов.
  whatsapp: "992900000000",
  // Имя пользователя Telegram без «@».
  telegram: "smeg_tjk",
  instagram: "smeg_tjk",
  instagramUrl: "https://www.instagram.com/smeg_tjk/",
  followers: "9 000+",
  // Координаты центра Истаравшана для карты.
  map: { lat: 39.9108, lng: 69.0063, zoom: 14 },
  foundedYear: 1948,
  // Год в подвале. Статический, чтобы страницы собирались заранее.
  copyrightYear: 2026,
} as const;
