"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ScrollerProps = {
  children: React.ReactNode;
  className?: string;
  trackClassName?: string;
  ariaLabel: string;
  /** Что показать слева от стрелок, например ссылку «Весь каталог». */
  aside?: React.ReactNode;
};

const arrow =
  "flex size-11 cursor-pointer items-center justify-center rounded-full border border-ink/30 text-ink transition-[background-color,color,border-color] duration-300 hover:border-ink hover:bg-ink hover:text-white disabled:cursor-default disabled:opacity-25 disabled:hover:border-ink/30 disabled:hover:bg-transparent disabled:hover:text-ink";

/** Горизонтальная карусель с прокруткой, стрелками и полосой прогресса. */
export function Scroller({ children, className, trackClassName, ariaLabel, aside }: ScrollerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ start: true, end: false, progress: 0 });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setState({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft >= max - 2,
      progress: max > 0 ? Math.min(1, el.scrollLeft / max) : 1,
    });
  }, []);

  useEffect(() => {
    update();
    const el = ref.current;
    el?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: -1 | 1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={cn(
          "no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12",
          trackClassName,
        )}
      >
        {children}
      </div>

      <div className="mt-6 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative h-px w-32 bg-line sm:w-48" aria-hidden>
            <span
              className="absolute inset-y-0 left-0 bg-ink transition-[width] duration-300"
              style={{ width: `${Math.max(8, state.progress * 100)}%` }}
            />
          </div>
          {aside}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => scroll(-1)} disabled={state.start} aria-label="Прокрутить назад" className={arrow}>
            <ChevronLeft className="size-5" strokeWidth={1.75} />
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={state.end} aria-label="Прокрутить вперёд" className={arrow}>
            <ChevronRight className="size-5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
