"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { Slide } from "@/data/slides";
import { cn } from "@/lib/utils";

const INTERVAL = 7000;
const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const parallax = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused || reduce || slides.length < 2) return;
    const timer = window.setInterval(() => go(1), INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused, reduce, go, slides.length, index]);

  const slide = slides[index];

  return (
    <section
      ref={ref}
      className="on-dark relative h-[72svh] min-h-[520px] overflow-hidden bg-black text-white sm:h-[78svh] lg:h-[calc(100svh-142px)] lg:max-h-[880px]"
      aria-roledescription="карусель"
      aria-label="Главные предложения"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h1 className="sr-only">SMEG Tajikistan — официальный партнёр SMEG в Таджикистане</h1>

      <motion.div style={{ y: parallax }} className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: EASE }}
            className="absolute inset-0"
            aria-hidden={false}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              sizes="100vw"
              className={cn("object-cover", !reduce && "kenburns")}
              style={{ objectPosition: slide.position ?? "center" }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Затемнение слева для текста, как на smeg.com */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />

      <motion.div style={{ opacity: fade }} className="relative flex h-full items-end lg:items-center">
        <Container className="pb-20 lg:pb-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.3 } }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
              className="max-w-xl"
            >
              <h2 className="t-display text-[clamp(2.1rem,4.4vw,3.4rem)]">{slide.title}</h2>
              <p className="mt-5 max-w-lg text-[15px] font-light leading-relaxed text-white/85 sm:text-[17px]">
                {slide.text}
              </p>
              <Link href={slide.href as Route} className="line-link mt-7 text-white">
                {slide.cta}
              </Link>
            </motion.div>
          </AnimatePresence>
        </Container>
      </motion.div>

      {/* Стрелки */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Предыдущий слайд"
            className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-black shadow-md transition-[background-color,transform] duration-300 hover:bg-white hover:scale-105 sm:left-5"
          >
            <ChevronLeft className="size-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Следующий слайд"
            className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/85 text-black shadow-md transition-[background-color,transform] duration-300 hover:bg-white hover:scale-105 sm:right-5"
          >
            <ChevronRight className="size-5" strokeWidth={2} />
          </button>
          <div className="absolute inset-x-0 bottom-6 flex justify-center gap-2" role="tablist" aria-label="Слайды">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Слайд ${i + 1}: ${s.title}`}
                onClick={() => setIndex(i)}
                className="flex h-6 cursor-pointer items-center px-1"
              >
                <span
                  className={cn(
                    "block h-[3px] rounded-full bg-white transition-[width,opacity] duration-500",
                    i === index ? "w-8 opacity-100" : "w-3 opacity-50",
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
