import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ProductCard } from "@/components/ui/product-card";
import type { Product } from "@/data/types";

export function Popular({ products }: { products: Product[] }) {
  return (
    <section id="popular" className="scroll-mt-28 py-16 sm:py-24" aria-labelledby="popular-title">
      <Container>
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="popular-title" className="t-section">
            Популярные товары
          </h2>
          <Link href="/catalog" className="line-link text-ink">
            Весь каталог
          </Link>
        </Reveal>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.slice(0, 8).map((p, i) => (
            <Reveal as="li" key={p.slug} delay={(i % 4) * 0.07}>
              <ProductCard product={p} priority={i < 4} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
