import { Hero } from "@/components/sections/hero";
import { Categories } from "@/components/sections/categories";
import { ColorStudio } from "@/components/sections/color-studio";
import { Shelf } from "@/components/sections/shelf";
import { PreorderPromo } from "@/components/sections/preorder-promo";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Services } from "@/components/sections/services";
import { Contacts } from "@/components/sections/contacts";
import { getFeatured, getProduct } from "@/lib/products";
import { products } from "@/data/products";

export default function HomePage() {
  const fab28 = getProduct("fab28") ?? products[0];
  const airFryer = getProduct("afc01-dual-flavour");
  const featured = getFeatured();

  return (
    <>
      <Hero />
      <Categories />
      <ColorStudio hero={fab28} companions={featured} />
      <Shelf products={featured} />
      {airFryer && <PreorderPromo product={airFryer} />}
      <About />
      <Reviews />
      <Services />
      <Contacts />
    </>
  );
}
