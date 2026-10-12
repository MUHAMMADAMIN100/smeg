import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { categories } from "@/data/categories";
import { getCategoryCounts, productImage } from "@/lib/products";
import { plural } from "@/lib/format";

export function Categories() {
  const counts = getCategoryCounts();
  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <section id="categories" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="categories-title">
      <Container>
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              number="01"
              eyebrow="Категории"
              title={
                <span id="categories-title">
                  Вся кухня в одном стиле
                </span>
              }
              description="От холодильника до тостера — каждая вещь SMEG повторяет линии 1950-х и выпускается в одной палитре. Собирайте гарнитур в своём цвете."
            />
          </Reveal>
          <Reveal delay={0.15} className="md:pb-2">
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-fg"
            >
              Весь каталог
              <span className="flex size-9 items-center justify-center rounded-full border border-line-strong transition-[background-color,color,border-color] duration-300 group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </span>
            </Link>
          </Reveal>
        </div>

        <ul className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {sorted.map((c, i) => {
            const count = counts[c.id];
            return (
              <Reveal as="li" key={c.id} delay={(i % 4) * 0.08} className="w-[72vw] shrink-0 snap-start sm:w-auto">
                <Link
                  href={`/catalog?category=${c.id}` as Route}
                  className="group block"
                  aria-label={`${c.name}: ${count} ${plural(count, ["модель", "модели", "моделей"])}`}
                >
                  <div
                    className="relative aspect-square overflow-hidden rounded-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                    style={{ backgroundColor: c.tint }}
                  >
                    <span
                      className="absolute inset-3 rounded-full border border-dashed border-ink/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-[spin_30s_linear_infinite]"
                      aria-hidden
                    />
                    <div className="absolute inset-[16%] transition-transform duration-700 ease-out-expo group-hover:-translate-y-2 group-hover:rotate-[-2deg]">
                      <Image
                        src={productImage(c.coverSku)}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 72vw"
                        className="product-photo object-contain"
                        draggable={false}
                      />
                    </div>
                    <span className="absolute top-5 left-6 font-display text-sm text-ink/60">
                      0{c.order}
                    </span>
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-3 px-1">
                    <div>
                      <h3 className="font-display text-2xl leading-none text-fg transition-colors group-hover:text-smeg">
                        {c.name}
                      </h3>
                      <p className="mt-2 text-sm text-fg-muted">{c.caption}</p>
                    </div>
                    <span className="eyebrow mt-1 shrink-0 text-[11px]">
                      {count} {plural(count, ["модель", "модели", "моделей"])}
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
