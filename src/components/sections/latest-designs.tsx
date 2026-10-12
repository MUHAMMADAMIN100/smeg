import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Scroller } from "@/components/ui/scroller";

const ITEMS = [
  {
    title: "Аэрогриль Dual Flavour: воздух и пар",
    image: "/lifestyle/airfryer-black.jpg",
    href: "/catalog/afc01-dual-flavour",
  },
  {
    title: "Планетарный миксер SMF05 с прямым приводом",
    image: "/lifestyle/mixer-smf05.jpg",
    href: "/catalog/smf05",
  },
  {
    title: "Автоматическая кофемашина BCC13",
    image: "/lifestyle/coffee-bcc.jpg",
    href: "/catalog/bcc13",
  },
  {
    title: "Чайник KLF04 с терморегулятором",
    image: "/lifestyle/kettle-klf03.jpg",
    href: "/catalog/klf04",
  },
  {
    title: "Блендер BLF03 с программами для льда и смузи",
    image: "/lifestyle/blender-blf03.jpg",
    href: "/catalog/blf03",
  },
] as const;

/** «Our latest designs» со smeg.com: карусель карточек с lifestyle-фото. */
export function LatestDesigns() {
  return (
    <section id="new" className="scroll-mt-28 py-16 sm:py-24" aria-labelledby="new-title">
      <Container>
        <Reveal>
          <h2 id="new-title" className="t-section">
            Наши новинки
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <Scroller ariaLabel="Новинки" trackClassName="gap-7">
            {ITEMS.map((item) => (
              <article key={item.href} className="w-[82vw] shrink-0 snap-start sm:w-[420px] lg:w-[calc((100%-56px)/3)]">
                <Link href={item.href as Route} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-smoke">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 420px, 82vw"
                      className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.05]"
                    />
                  </div>
                  <h3 className="t-card mt-6 text-balance">{item.title}</h3>
                  <span className="line-link mt-5 text-ink">Узнать больше</span>
                </Link>
              </article>
            ))}
          </Scroller>
        </Reveal>
      </Container>
    </section>
  );
}
