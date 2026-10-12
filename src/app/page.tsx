import { HeroSlider } from "@/components/sections/hero-slider";
import { SplitAppliances } from "@/components/sections/split-appliances";
import { LatestDesigns } from "@/components/sections/latest-designs";
import { AestheticLines } from "@/components/sections/aesthetic-lines";
import { Popular } from "@/components/sections/popular";
import { About } from "@/components/sections/about";
import { slides } from "@/data/slides";
import { getFeatured } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <HeroSlider slides={slides} />
      <SplitAppliances />
      <LatestDesigns />
      <AestheticLines />
      <Popular products={getFeatured()} />
      <About />
    </>
  );
}
