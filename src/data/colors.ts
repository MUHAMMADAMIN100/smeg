export type ColorId =
  | "pastel-blue"
  | "pink"
  | "cream"
  | "mint"
  | "red"
  | "black"
  | "white"
  | "silver"
  | "emerald"
  | "storm-blue"
  | "yellow"
  | "orange"
  | "olive"
  | "anthracite"
  | "grey";

export type SmegColor = {
  id: ColorId;
  /** Название по-русски, как в карточке товара. */
  name: string;
  /** Оригинальное название SMEG. */
  original: string;
  /** Основной HEX цвета для свотча. */
  hex: string;
  /** Пастельный фон-«пятно» под товаром в светлой теме. */
  tint: string;
  /** Фон-«пятно» в тёмной теме. */
  tintDark: string;
  /** Цвет текста поверх свотча. */
  on: "light" | "dark";
};

export const colors: SmegColor[] = [
  { id: "pastel-blue", name: "Пастельно-голубой", original: "Pastel Blue", hex: "#a8d3e6", tint: "#cfe6f0", tintDark: "#223642", on: "dark" },
  { id: "pink", name: "Розовый", original: "Pink", hex: "#f3c3ce", tint: "#f8dde3", tintDark: "#3f2a30", on: "dark" },
  { id: "cream", name: "Кремовый", original: "Cream", hex: "#f2e2b8", tint: "#f7ecd1", tintDark: "#3a3324", on: "dark" },
  { id: "mint", name: "Мятный", original: "Pastel Green", hex: "#bfdcc9", tint: "#d9eadf", tintDark: "#243a2e", on: "dark" },
  { id: "red", name: "Красный", original: "Red", hex: "#d7282f", tint: "#f3cfd0", tintDark: "#3d1e20", on: "light" },
  { id: "black", name: "Чёрный", original: "Black", hex: "#1c1c1c", tint: "#dedad3", tintDark: "#2a2724", on: "light" },
  { id: "white", name: "Белый", original: "White", hex: "#f4f4f2", tint: "#ebe6dd", tintDark: "#2e2b27", on: "dark" },
  { id: "silver", name: "Серебристый", original: "Silver", hex: "#c9cbcf", tint: "#e3e3e1", tintDark: "#2c2e31", on: "dark" },
  { id: "yellow", name: "Жёлтый", original: "Yellow", hex: "#f2c94c", tint: "#f9e9b3", tintDark: "#3d3516", on: "dark" },
  { id: "orange", name: "Оранжевый", original: "Orange", hex: "#e8742a", tint: "#f7d9c3", tintDark: "#3f2716", on: "light" },
  { id: "emerald", name: "Изумрудный", original: "Emerald Green", hex: "#2e6b4f", tint: "#cfe0d4", tintDark: "#1d3328", on: "light" },
  { id: "storm-blue", name: "Грозовой синий", original: "Storm Blue", hex: "#5b7a8c", tint: "#d3dde3", tintDark: "#243038", on: "light" },
  { id: "olive", name: "Оливковый", original: "Olive Green", hex: "#6b7a4b", tint: "#dde2cf", tintDark: "#27301c", on: "light" },
  { id: "anthracite", name: "Антрацит", original: "Anthracite", hex: "#4a4a4a", tint: "#dcdad6", tintDark: "#2b2b2b", on: "light" },
  { id: "grey", name: "Серый", original: "Slate Grey", hex: "#8c9196", tint: "#e0e2e4", tintDark: "#2d3033", on: "light" },
];

export const colorById = Object.fromEntries(colors.map((c) => [c.id, c])) as Record<ColorId, SmegColor>;

/** Цвета для «Цветовой студии» на главной: самые узнаваемые оттенки SMEG. */
export const studioColorIds: ColorId[] = [
  "pastel-blue",
  "pink",
  "cream",
  "mint",
  "red",
  "black",
  "white",
  "silver",
  "yellow",
  "orange",
];
