import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Scroller } from "@/components/ui/scroller";
import { ProductCard } from "@/components/ui/product-card";
import type { Product } from "@/data/types";

export function Shelf({ products }: { products: Product[] }) {
  return (
    <section id="bestsellers" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="shelf-title">
      <Container>
        <Reveal>
          <SectionHeading
            number="03"
            eyebrow="Бестселлеры"
            title={<span id="shelf-title">Что выбирают чаще всего</span>}
            description="Восемь вещей, с которых обычно начинается кухня SMEG. Наведите на цвет, чтобы примерить."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Scroller
            ariaLabel="Бестселлеры"
            aside={
              <Link href="/catalog" className="group hidden items-center gap-2 text-[15px] font-medium text-fg sm:inline-flex">
                Весь каталог
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
              </Link>
            }
          >
            {products.map((p, i) => (
              <div key={p.slug} className="w-[78vw] shrink-0 snap-start sm:w-[340px]">
                <ProductCard product={p} priority={i < 2} sizes="(min-width: 640px) 340px, 78vw" />
              </div>
            ))}
          </Scroller>
        </Reveal>
      </Container>
    </section>
  );
}
