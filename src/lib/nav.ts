import type { CategoryId } from "@/data/categories";

export type NavLink = { label: string; href: string };

/** Группы категорий для выпадающих меню, как «Major / Small appliances» на smeg.com. */
export type NavGroup = {
  id: "major" | "small";
  label: string;
  href: string;
  categories: CategoryId[];
  /** Артикул для фото в выпадающем меню. */
  coverSku: string;
  caption: string;
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "major",
    label: "Крупная техника",
    href: "/catalog?group=major",
    categories: ["fridges", "cookers", "ovens"],
    coverSku: "FAB28RPB6",
    caption: "Холодильники, плиты и духовые шкафы в стиле 50-х, Portofino и Victoria",
  },
  {
    id: "small",
    label: "Малая техника",
    href: "/catalog?group=small",
    categories: ["coffee", "toasters", "kettles", "airfryers", "kitchen"],
    coverSku: "EGF03CREU",
    caption: "Кофемашины, тостеры, чайники, миксеры и аэрогриль Dual Flavour",
  },
];

export const NAV_LINKS: NavLink[] = [
  { label: "Новинки", href: "/#new" },
  { label: "Цвета", href: "/colors" },
  { label: "О бренде", href: "/#about" },
];

export const TOP_LINKS_LEFT: NavLink[] = [
  { label: "Официальный партнёр SMEG", href: "/#about" },
  { label: "Доставка и гарантия", href: "/contacts#service" },
];

export const TOP_LINKS_RIGHT: NavLink[] = [
  { label: "Контакты", href: "/contacts" },
  { label: "Сервис", href: "/contacts#service" },
];

export const GROUP_BY_CATEGORY: Record<CategoryId, NavGroup["id"]> = {
  fridges: "major",
  cookers: "major",
  ovens: "major",
  coffee: "small",
  toasters: "small",
  kettles: "small",
  airfryers: "small",
  kitchen: "small",
};
