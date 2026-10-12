import type { Metadata } from "next";
import { ColorStudio } from "@/components/sections/color-studio";
import { getFeatured, getProduct } from "@/lib/products";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Цвета",
  description:
    "Десять фирменных цветов SMEG: пастельно-голубой, розовый, кремовый, мятный, красный, чёрный, белый и другие. Примерьте цвет на холодильник FAB28.",
};

export default function ColorsPage() {
  const fab28 = getProduct("fab28") ?? products[0];
  return <ColorStudio hero={fab28} companions={getFeatured()} />;
}
