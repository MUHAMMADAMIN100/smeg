import type { CategoryId } from "@/data/categories";
import type { ColorId } from "@/data/colors";

export type Badge = "new" | "preorder" | "hit";

export type Variant = {
  color: ColorId;
  /** Артикул SMEG, по нему же называется файл фото в public/products. */
  sku: string;
};

export type Spec = { label: string; value: string };

export type Product = {
  slug: string;
  /** Название по-русски, например «Холодильник FAB28». */
  name: string;
  /** Семейство модели, например «FAB28». */
  model: string;
  category: CategoryId;
  /** Ориентировочная цена в сомони. */
  price: number;
  oldPrice?: number;
  badge?: Badge;
  /** Одна строка для карточки. */
  short: string;
  /** Абзац для страницы товара. */
  description: string;
  /** Три-четыре главных преимущества. */
  features: string[];
  specs: Spec[];
  variants: Variant[];
  /** Показывать на полке бестселлеров. */
  featured?: boolean;
};
