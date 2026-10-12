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
    <article className="pb-24 pt-8 sm:pt-10">
      <Container>
        <nav aria-label="Хлебные крошки" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-fg-muted">
          <Link href="/" className="transition-colors hover:text-fg">Главная</Link>
          <ChevronRight className="size-3.5 text-fg-faint" aria-hidden />
          <Link href="/catalog" className="transition-colors hover:text-fg">Каталог</Link>
          <ChevronRight className="size-3.5 text-fg-faint" aria-hidden />
          <Link href={`/catalog?category=${category.id}` as Route} className="transition-colors hover:text-fg">
            {category.name}
          </Link>
          <ChevronRight className="size-3.5 text-fg-faint" aria-hidden />
          <span className="text-fg">{product.name}</span>
        </nav>

        <Suspense fallback={<div className="aspect-square w-full rounded-[36px] bg-surface-2 lg:w-7/12" />}>
          <ProductView product={product} />
        </Suspense>

        {/* Описание и характеристики */}
        <div className="mt-20 grid gap-12 border-t border-line pt-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow">О модели</p>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fg">{product.description}</p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <p className="eyebrow">Главное</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {product.features.map((f) => (
                  <li key={f} className="flex gap-3 rounded-2xl border border-line bg-surface p-4 text-[15px] leading-snug text-fg">
                    <Check className="mt-0.5 size-4 shrink-0 text-smeg" strokeWidth={2.5} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            <p className="eyebrow">Характеристики</p>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {product.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[1fr_auto] gap-4 py-3.5 text-[15px]">
                  <dt className="text-fg-muted">{s.label}</dt>
                  <dd className="text-right font-medium text-fg">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Похожие */}
        {related.length > 0 && (
          <div className="mt-24">
            <Reveal>
              <div className="flex items-end justify-between gap-6">
                <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-tight text-fg">Смотрите также</h2>
                <Link href={`/catalog?category=${category.id}` as Route} className="text-[15px] font-medium text-fg-muted transition-colors hover:text-fg">
                  Все {category.name.toLowerCase()}
                </Link>
              </div>
            </Reveal>
            <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={i * 0.06}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </article>
  );
}
