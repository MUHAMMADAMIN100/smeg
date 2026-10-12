export type CategoryId =
  | "fridges"
  | "cookers"
  | "ovens"
  | "coffee"
  | "toasters"
  | "kettles"
  | "airfryers"
  | "kitchen";

export type Category = {
  id: CategoryId;
  name: string;
  /** Короткая подпись под плиткой. */
  caption: string;
  /** Пастельный цвет плитки как в highlights Instagram. */
  tint: string;
  /** Артикул товара для обложки категории. */
  coverSku: string;
  /** Порядок на лендинге. */
  order: number;
};

export const categories: Category[] = [
  { id: "fridges", name: "Холодильники", caption: "FAB28 · FAB32 · FAB10", tint: "#cfe6f0", coverSku: "FAB28RPB6", order: 1 },
  { id: "cookers", name: "Плиты", caption: "Portofino · Victoria", tint: "#f7ecd1", coverSku: "CPF9GPYW", order: 2 },
  { id: "ovens", name: "Печи", caption: "Встраиваемые и настольные", tint: "#dedad3", coverSku: "COF01CREU", order: 3 },
  { id: "coffee", name: "Кофемашины", caption: "Эспрессо · капельные · автомат", tint: "#f3cfd0", coverSku: "ECF02RDEU", order: 4 },
  { id: "toasters", name: "Тостеры", caption: "2 и 4 ломтика", tint: "#f8dde3", coverSku: "TSF01PKEU", order: 5 },
  { id: "kettles", name: "Чайники", caption: "1,7 л · 0,8 л · с терморегулятором", tint: "#d9eadf", coverSku: "KLF03PGEU", order: 6 },
  { id: "airfryers", name: "Аэрогрили", caption: "Dual Flavour · предзаказ", tint: "#ebe6dd", coverSku: "AFC01EGMEU", order: 7 },
  { id: "kitchen", name: "Для кухни", caption: "Миксеры · блендеры · соковыжималки", tint: "#f9e9b3", coverSku: "SMF05PBEU", order: 8 },
];

export const categoryById = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<CategoryId, Category>;
