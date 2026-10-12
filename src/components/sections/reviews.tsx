import Image from "next/image";
import { Star } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Scroller } from "@/components/ui/scroller";
import { Button } from "@/components/ui/button";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { productImage } from "@/lib/products";

const FEED = ["FAB28RPK6", "TSF01PGEU", "KLF03RDEU", "SMF05PBEU", "ECF02CREU", "FAB10RYW6"];

export function Reviews() {
  return (
    <section id="reviews" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="reviews-title">
      <Container>
        <Reveal>
          <SectionHeading
            number="05"
            eyebrow="Отзывы"
            title={<span id="reviews-title">Нас рекомендуют друзьям</span>}
            description="Истории покупателей из Истаравшана, Худжанда и Душанбе. Больше — в закреплённых историях нашего Instagram."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <Scroller ariaLabel="Отзывы покупателей">
            {reviews.map((r) => (
              <article
                key={r.name + r.product}
                className="flex w-[82vw] shrink-0 snap-start flex-col justify-between rounded-[28px] p-7 text-ink sm:w-[380px]"
                style={{ backgroundColor: r.tint }}
              >
                <div>
                  <div className="flex items-center gap-1" aria-label={`Оценка ${r.rating} из 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={i < r.rating ? "size-4 fill-ink text-ink" : "size-4 text-ink/30"}
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="font-display mt-5 text-[1.35rem] leading-snug">«{r.text}»</p>
                </div>
                <footer className="mt-8 border-t border-ink/10 pt-4">
                  <p className="font-semibold">{r.name} · {r.city}</p>
                  <p className="mt-1 text-sm text-ink/60">{r.product}</p>
                </footer>
              </article>
            ))}
          </Scroller>
        </Reveal>

        {/* Instagram */}
        <Reveal delay={0.15} className="mt-16">
          <div className="grid gap-8 overflow-hidden rounded-[36px] border border-line bg-surface p-7 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="eyebrow flex items-center gap-2">
                <InstagramIcon className="size-4" /> @{site.instagram}
              </p>
              <p className="font-display mt-5 text-[clamp(2.4rem,5vw,4.4rem)] leading-none text-fg">
                {site.followers}
                <span className="block text-[0.45em] text-fg-muted">подписчиков следят за новинками</span>
              </p>
              <p className="mt-5 max-w-md text-fg-muted leading-relaxed">
                Новые поставки, цвета и распаковки показываем первыми в Instagram. Там же отвечаем в директ ежедневно с {site.hoursShort}.
              </p>
              <Button href={site.instagramUrl} external className="mt-7" icon={<InstagramIcon className="size-4" strokeWidth={2} />} iconPosition="left">
                Открыть профиль
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:col-span-7">
              {FEED.map((sku, i) => (
                <a
                  key={sku}
                  href={site.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Открыть Instagram SMEG Tajikistan"
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-tray"
                >
                  <Image
                    src={productImage(sku)}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 18vw, 30vw"
                    className="product-photo object-contain p-4 transition-transform duration-700 ease-out-expo group-hover:scale-105"
                    draggable={false}
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-cream opacity-0 transition-[background-color,opacity] duration-300 group-hover:bg-ink/25 group-hover:opacity-100">
                    <InstagramIcon className="size-6" />
                  </span>
                  <span className="sr-only">{i + 1}</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
