import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { ChevronRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/ui/product-card";
import { Reveal } from "@/components/ui/reveal";
import { ProductView } from "@/components/product/product-view";
import { categoryById } from "@/data/categories";
import { getAllSlugs, getProduct, getRelated, productImage } from "@/lib/products";

type Params = { slug: string };

/** Все товары известны на этапе сборки: чужие slug сразу получают 404. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} ${product.model}`,
    description: product.short,
    openGraph: {
      title: `${product.name} — SMEG Tajikistan`,
      description: product.short,
      images: [{ url: productImage(product.variants[0].sku), width: 1300, height: 1300 }],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categoryById[product.category];
  const related = getRelated(product, 4);

  return (
    <div className="pb-24 pt-8 sm:pt-10">
      <Container>
        <nav aria-label="Хлебные крошки" className="t-small mb-8 flex flex-wrap items-center gap-1.5 text-muted">
          <Link href="/" className="transition-colors hover:text-ink">Главная</Link>
          <ChevronRight className="size-3.5 text-faint" aria-hidden />
          <Link href="/catalog" className="transition-colors hover:text-ink">Каталог</Link>
          <ChevronRight className="size-3.5 text-faint" aria-hidden />
          <Link href={`/catalog?category=${category.id}` as Route} className="transition-colors hover:text-ink">
            {category.name}
          </Link>
          <ChevronRight className="size-3.5 text-faint" aria-hidden />
          <span className="text-ink">{product.name}</span>
        </nav>

        <Suspense fallback={<div className="aspect-square w-full bg-smoke lg:w-7/12" />}>
          <ProductView product={product} />
        </Suspense>

        <div className="mt-20 grid gap-14 border-t border-line pt-14 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="t-label text-muted">О модели</p>
              <p className="mt-5 max-w-2xl text-lg font-light leading-relaxed text-ink">{product.description}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <p className="t-label text-muted">Главное</p>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 py-3.5 text-[15px] font-light leading-snug text-ink">
                    <Check className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="t-label text-muted">Характеристики</p>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[1fr_auto] gap-4 py-3 text-[15px]">
                  <dt className="font-light text-muted">{s.label}</dt>
                  <dd className="text-right font-semibold text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="t-section">Смотрите также</h2>
              <Link href={`/catalog?category=${category.id}` as Route} className="line-link text-ink">
                Все {category.name.toLowerCase()}
              </Link>
            </Reveal>
            <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </div>
  );
}
