/** Слайды главного экрана, как hero-слайдер на smeg.com. Фото лежат в public/lifestyle. */
export type Slide = {
  id: string;
  image: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  /** Положение фото при обрезке. */
  position?: string;
};

export const slides: Slide[] = [
  {
    id: "moonlight",
    image: "/lifestyle/moonlight.jpg",
    title: "Коллекция Moonlight",
    text: "Мягкое матовое покрытие на легендарных формах 50-х. Баланс, элегантность и гармония на вашей кухне.",
    href: "/catalog?category=fridges",
    cta: "Смотреть холодильники",
    position: "center 40%",
  },
  {
    id: "airfryer",
    image: "/lifestyle/airfryer-crispy.jpg",
    title: "Аэрогриль Dual Flavour",
    text: "Два режима в одном корпусе: хрустящая корочка горячим воздухом и сочность с помощью пара. Доступен по предзаказу.",
    href: "/catalog/afc01-dual-flavour",
    cta: "Забронировать",
    position: "center",
  },
  {
    id: "portofino",
    image: "/lifestyle/line-portofino.jpg",
    title: "Плиты Portofino",
    text: "Девяносто сантиметров характера: шесть конфорок, духовка на 115 литров и восемь цветов эмали.",
    href: "/catalog?category=cookers",
    cta: "Смотреть плиты",
    position: "center",
  },
  {
    id: "coffee",
    image: "/lifestyle/hero-coffee.jpg",
    title: "Дом кофе Smeg",
    text: "Рожковые и автоматические кофемашины, кофемолки и вспениватели в одной палитре с остальной кухней.",
    href: "/catalog?category=coffee",
    cta: "Смотреть кофемашины",
    position: "center",
  },
];
