"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Задержка в секундах, удобно для стаггера списков. */
  delay?: number;
  /** Смещение по вертикали в пикселях до появления. */
  y?: number;
  /** Небольшое увеличение при появлении. */
  scale?: boolean;
  once?: boolean;
  amount?: number;
  as?: "div" | "section" | "li" | "article" | "span";
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  scale = false,
  once = true,
  amount = 0.2,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      initial={reduce ? false : { opacity: 0, y, scale: scale ? 0.96 : 1 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}

/** Появление текста построчно: каждая строка — отдельный span. */
export function RevealLines({ lines, className, delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className="block"
            initial={reduce ? false : { y: "110%", rotate: 1.5 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, delay: delay + i * 0.1, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
