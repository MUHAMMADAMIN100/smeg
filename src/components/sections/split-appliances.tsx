import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { Reveal } from "@/components/ui/reveal";
import { productCutout } from "@/lib/products";
import { cn } from "@/lib/utils";

const HALVES = [
  {
    id: "major",
    title: "Крупная техника",
    href: "/catalog?group=major",
    sku: "SF6905N1",
    alt: "Духовой шкаф SMEG Victoria",
    dark: false,
  },
  {
    id: "small",
    title: "Малая техника",
    href: "/catalog?group=small",
    sku: "EGF03CREU",
    alt: "Кофемашина SMEG EGF03 кремовая",
    dark: true,
  },
] as const;

/** Блок «Major appliances / Small appliances» со smeg.com: белая и чёрная половины. */
export function SplitAppliances() {
  return (
    <section className="grid md:grid-cols-2" aria-label="Крупная и малая техника">
      {HALVES.map((h, i) => (
        <Link
          key={h.id}
          href={h.href as Route}
          className={cn(
            "group relative flex flex-col items-center overflow-hidden px-6 pt-16 pb-10 text-center sm:px-10 sm:pt-20",
            h.dark ? "on-dark bg-black text-white" : "bg-white text-ink",
          )}
        >
          <Reveal delay={i * 0.1} className="flex w-full flex-col items-center">
            <h2 className="t-section">{h.title}</h2>
            <span className="line-link mt-6">Смотреть все товары</span>
            <div className="relative mt-10 aspect-square w-full max-w-[460px] transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
              <Image
                src={productCutout(h.sku)}
                alt={h.alt}
                fill
                sizes="(min-width: 768px) 46vw, 90vw"
                className="object-contain"
              />
            </div>
          </Reveal>
        </Link>
      ))}
    </section>
  );
}
