import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const LINES = [
  {
    title: "Стиль 50-х",
    text: "Округлые формы, хром и эмаль в десяти фирменных цветах. Холодильники FAB и вся малая техника.",
    image: "/lifestyle/moonlight-fab.jpg",
    href: "/catalog?category=fridges",
  },
  {
    title: "Portofino",
    text: "Плиты и духовые шкафы 90 см с ярким характером: жёлтый, оранжевый, оливковый и ещё пять цветов.",
    image: "/lifestyle/line-portofino.jpg",
    href: "/catalog?category=cookers",
  },
  {
    title: "Victoria",
    text: "Классика английской кухни: кремовая, чёрная и серая эмаль с хромированной фурнитурой.",
    image: "/lifestyle/line-victoria.jpg",
    href: "/catalog?category=ovens",
  },
] as const;

/** «Aesthetic lines» со smeg.com. */
export function AestheticLines() {
  return (
    <section id="lines" className="scroll-mt-28 bg-smoke py-16 sm:py-24" aria-labelledby="lines-title">
      <Container>
        <Reveal>
          <h2 id="lines-title" className="t-section">
            Линии дизайна
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {LINES.map((line, i) => (
            <Reveal key={line.title} delay={i * 0.1}>
              <Link href={line.href as Route} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden bg-white">
                  <Image
                    src={line.image}
                    alt={line.title}
                    fill
                    sizes="(min-width: 768px) 30vw, 90vw"
                    className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="t-card mt-6">{line.title}</h3>
                <p className="mt-3 text-[15px] font-light leading-relaxed text-muted">{line.text}</p>
                <span className="line-link mt-5 text-ink">Узнать больше</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
