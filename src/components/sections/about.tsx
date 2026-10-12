import Image from "next/image";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { productImage } from "@/lib/products";

const MILESTONES = [
  { year: "1948", text: "Витторио Бертаццони основывает Smeg в Гвасталле, Эмилия-Романья. Первые изделия — эмалированные плиты." },
  { year: "1997", text: "Выходит FAB28 — холодильник с округлыми формами и хромированной ручкой, ставший иконой дизайна." },
  { year: "2014", text: "Линейка малой техники в стиле 50-х: тостеры, чайники, миксеры и кофемашины в одной палитре." },
  { year: "Сегодня", text: "Техника Smeg продаётся более чем в 100 странах, а в Таджикистане её представляем мы, официально." },
];

const FAMILY = [
  { sku: "FAB28RCR6", alt: "Холодильник FAB28 кремовый", className: "left-[2%] bottom-0 w-[36%]", delay: 0 },
  { sku: "SMF05CREU", alt: "Миксер SMF05 кремовый", className: "left-[40%] bottom-[2%] w-[27%]", delay: 0.1 },
  { sku: "ECF02CREU", alt: "Кофемашина ECF02 кремовая", className: "right-[2%] bottom-[2%] w-[22%]", delay: 0.2 },
  { sku: "KLF03CREU", alt: "Чайник KLF03 кремовый", className: "right-[24%] bottom-[30%] w-[18%]", delay: 0.3 },
  { sku: "TSF01CREU", alt: "Тостер TSF01 кремовый", className: "left-[38%] bottom-[34%] w-[22%]", delay: 0.4 },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20 overflow-hidden py-20 sm:py-28" aria-labelledby="about-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                number="04"
                eyebrow="О бренде"
                title={<span id="about-title">Италия, 1948. Красота как функция</span>}
                description="Smeg — семейная компания из Эмилии-Романьи, где дизайн обсуждают так же серьёзно, как инженерию. Отсюда округлые линии, эмаль и хром, которые хочется трогать."
              />
            </Reveal>

            <ol className="mt-12 space-y-0 border-t border-line">
              {MILESTONES.map((m, i) => (
                <Reveal as="li" key={m.year} delay={i * 0.08} className="grid grid-cols-[88px_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[110px_1fr]">
                  <span className="font-display text-xl text-smeg">{m.year}</span>
                  <p className="text-[15px] leading-relaxed text-fg-muted">{m.text}</p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.2} className="mt-10">
              <blockquote className="border-l-2 border-smeg pl-5">
                <p className="font-display text-2xl leading-snug text-fg sm:text-3xl">
                  «Технология должна быть красивой. Иначе зачем ставить её на видное место?»
                </p>
                <footer className="eyebrow mt-4">Философия Smeg · «Technology with style»</footer>
              </blockquote>
            </Reveal>
          </div>

          {/* Семейный портрет техники в кремовом цвете */}
          <div className="lg:col-span-7">
            <Reveal delay={0.1} scale className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[36px] bg-stone dark:bg-surface-2">
                <div className="absolute inset-x-0 bottom-0 h-[38%] bg-stone-200/70 dark:bg-surface" aria-hidden />
                <div className="absolute inset-x-0 bottom-[38%] h-px bg-ink/10 dark:bg-cream/10" aria-hidden />
                <span className="eyebrow absolute top-6 left-7 text-ink/50 dark:text-cream/50">Cream collection · Ø one palette</span>
                {FAMILY.map((f) => (
                  <Reveal key={f.sku} delay={0.2 + f.delay} y={40} className={`absolute ${f.className}`}>
                    <div className="relative aspect-square">
                      <Image
                        src={productImage(f.sku)}
                        alt={f.alt}
                        fill
                        sizes="(min-width: 1024px) 24vw, 40vw"
                        className="product-photo object-contain object-bottom drop-shadow-[0_30px_30px_rgba(21,19,15,0.18)]"
                        draggable={false}
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 px-2">
                <p className="text-sm text-fg-muted">Одна палитра на всю кухню: холодильник, миксер, кофемашина, чайник и тостер в кремовом.</p>
                <p className="eyebrow">Made in Italy</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
