"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import { productImage } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { site } from "@/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE = ["Техника,", "которую хочется", "показывать."];

const STATS = [
  { value: "1948", label: "год основания, Гвасталла" },
  { value: "10", label: "фирменных цветов" },
  { value: site.followers, label: "подписчиков в Instagram" },
];

const RIBBON = [
  "Made in Italy",
  "Стиль 50-х",
  "Официальный партнёр SMEG",
  "Официальная гарантия",
  "Доставка по Таджикистану",
  "Рассрочка",
  "10 фирменных цветов",
];

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yFridge = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const yKettle = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);
  const yToaster = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 18 });
  const sy = useSpring(my, { stiffness: 50, damping: 18 });
  const fridgeX = useTransform(sx, [-1, 1], [-10, 10]);
  const fridgeY = useTransform(sy, [-1, 1], [-8, 8]);
  const kettleX = useTransform(sx, [-1, 1], [18, -18]);
  const kettleY = useTransform(sy, [-1, 1], [14, -14]);
  const toasterX = useTransform(sx, [-1, 1], [-22, 22]);
  const toasterY = useTransform(sy, [-1, 1], [16, -16]);

  function onMove(e: React.MouseEvent) {
    if (reduce) return;
    const { innerWidth, innerHeight } = window;
    mx.set((e.clientX / innerWidth) * 2 - 1);
    my.set((e.clientY / innerHeight) * 2 - 1);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Тонкие вертикальные линии редакционной сетки */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
        <div className="mx-auto grid h-full max-w-[1440px] grid-cols-4 px-12">
          <span className="border-l border-line/60" />
          <span className="border-l border-line/60" />
          <span className="border-l border-line/60" />
          <span className="border-l border-line/60 border-r" />
        </div>
      </div>

      <Container className="relative grid min-h-[calc(100dvh-72px)] grid-cols-1 items-center gap-10 py-12 lg:grid-cols-12 lg:gap-6 lg:py-8">
        {/* Текст */}
        <motion.div style={{ opacity: textOpacity }} className="relative z-10 lg:col-span-7">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="eyebrow flex items-center gap-3"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-smeg opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-smeg" />
            </span>
            Официальный партнёр SMEG · Таджикистан
          </motion.p>

          <h1
            id="hero-title"
            className="font-display mt-7 text-[clamp(2.9rem,8vw,7.2rem)] leading-[0.98] tracking-[-0.015em] text-fg"
          >
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.1 + i * 0.12, ease: EASE }}
                >
                  {i === HEADLINE.length - 1 ? (
                    <span className="relative inline-block">
                      {line}
                      <motion.svg
                        viewBox="0 0 320 24"
                        className="absolute -bottom-2 left-0 h-[0.28em] w-full text-smeg"
                        fill="none"
                        aria-hidden
                      >
                        <motion.path
                          d="M4 16 C 60 6, 120 20, 170 12 S 280 4, 316 14"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
                        />
                      </motion.svg>
                    </span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted sm:text-xl"
          >
            Холодильники, плиты, кофемашины и малая техника SMEG в фирменных пастельных
            цветах. Привозим из Италии, устанавливаем и даём официальную гарантию.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button href="/catalog" size="lg" icon={<ArrowRight className="size-[18px]" strokeWidth={2} />}>
              Смотреть каталог
            </Button>
            <Button href="/#colors" size="lg" variant="outline" icon={<ArrowDown className="size-[18px]" strokeWidth={2} />}>
              Подобрать цвет
            </Button>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-line pt-6"
          >
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl text-fg sm:text-3xl">{s.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-fg-muted sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Сцена с товарами */}
        <div className="relative mx-auto w-full max-w-[560px] lg:col-span-5 lg:max-w-none">
          <div className="relative aspect-[4/5] w-full">
            <motion.div
              initial={reduce ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: EASE }}
              className="blob absolute inset-x-[4%] top-[6%] bottom-[8%] bg-pastel-blue/80 dark:bg-pastel-blue/70"
              aria-hidden
            />

            {/* Холодильник */}
            <motion.div
              style={{ y: yFridge, x: fridgeX, translateY: fridgeY }}
              initial={reduce ? false : { opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
              className="absolute inset-x-[14%] top-[2%] bottom-[2%]"
            >
              <Image
                src={productImage("FAB28RPB6")}
                alt="Холодильник SMEG FAB28 в пастельно-голубом цвете"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="product-photo object-contain drop-shadow-[0_40px_40px_rgba(21,19,15,0.12)]"
                draggable={false}
              />
            </motion.div>

            {/* Чайник */}
            <motion.div
              style={{ y: yKettle, x: kettleX, translateY: kettleY }}
              initial={reduce ? false : { opacity: 0, x: -40, rotate: -6 }}
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{ duration: 1.1, delay: 0.7, ease: EASE }}
              className="absolute top-[8%] left-[-2%] w-[34%] sm:left-0"
            >
              <FloatingCard sku="KLF03PKEU" title="Чайник KLF03" price={2190} alt="Чайник SMEG KLF03 розовый" />
            </motion.div>

            {/* Тостер */}
            <motion.div
              style={{ y: yToaster, x: toasterX, translateY: toasterY }}
              initial={reduce ? false : { opacity: 0, x: 40, rotate: 6 }}
              animate={{ opacity: 1, x: 0, rotate: 3 }}
              transition={{ duration: 1.1, delay: 0.85, ease: EASE }}
              className="absolute right-[-2%] bottom-[6%] w-[38%] sm:right-0"
            >
              <FloatingCard sku="TSF01CREU" title="Тостер TSF01" price={2490} alt="Тостер SMEG TSF01 кремовый" />
            </motion.div>

            {/* Круглая печать */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.1, ease: EASE }}
              className="absolute top-[4%] right-[2%] size-[22%] max-w-[120px] text-fg"
              aria-hidden
            >
              <svg viewBox="0 0 100 100" className="size-full animate-[spin_24s_linear_infinite]">
                <defs>
                  <path id="hero-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-current text-[9.5px] font-semibold uppercase tracking-[0.3em]">
                  <textPath href="#hero-circle">Made in Italy · dal 1948 · Smeg · </textPath>
                </text>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="size-2 rounded-full bg-smeg" />
              </span>
            </motion.div>
          </div>
        </div>
      </Container>

      <div className="relative border-y border-line bg-surface/60 py-4 text-sm font-medium uppercase tracking-[0.18em] text-fg-muted backdrop-blur-sm">
        <Marquee items={RIBBON} speed={46} />
      </div>
    </section>
  );
}

function FloatingCard({ sku, title, price, alt }: { sku: string; title: string; price: number; alt: string }) {
  return (
    <div className="rounded-[22px] border border-line bg-tray p-3 shadow-[0_24px_50px_-24px_rgba(21,19,15,0.35)]">
      <div className="relative aspect-square">
        <Image
          src={productImage(sku)}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 14vw, 32vw"
          className="product-photo object-contain"
          draggable={false}
        />
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 px-1">
        <span className="truncate text-xs font-semibold text-ink">{title}</span>
        <span className="shrink-0 text-xs tabular-nums text-ink/60">{formatPrice(price)}</span>
      </div>
    </div>
  );
}
