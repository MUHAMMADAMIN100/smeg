"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { categories, categoryById } from "@/data/categories";
import { productImage, searchProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";

const POPULAR = ["FAB28", "Тостер", "Чайник", "Кофемашина", "Portofino", "Аэрогриль"];

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchProducts(query, 8), [query]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Поиск по каталогу"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="on-dark fixed inset-0 z-[70] overflow-y-auto bg-black text-white"
        >
          <Container className="py-6 sm:py-8">
            <div className="flex items-center justify-between">
              <p className="t-label text-white/50">Поиск</p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть поиск"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <form
              className="mt-8 flex items-center gap-4 border-b border-white/30 pb-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (results[0]) {
                  router.push(`/catalog/${results[0].slug}` as Route);
                  onClose();
                }
              }}
            >
              <Search className="size-6 shrink-0 text-white/60" strokeWidth={1.5} aria-hidden />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Что ищете? Например, FAB28 или тостер"
                aria-label="Поисковый запрос"
                autoComplete="off"
                className="w-full bg-transparent text-2xl font-light outline-none placeholder:text-white/35 sm:text-3xl"
              />
            </form>

            {query.trim() === "" ? (
              <div className="mt-10 grid gap-10 md:grid-cols-2">
                <div>
                  <p className="t-label text-white/50">Часто ищут</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {POPULAR.map((p) => (
                      <li key={p}>
                        <button
                          type="button"
                          onClick={() => setQuery(p)}
                          className="cursor-pointer rounded-full border border-white/20 px-4 py-2 text-sm transition-colors hover:border-white"
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="t-label text-white/50">Категории</p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-6">
                    {categories.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/catalog?category=${c.id}` as Route}
                          onClick={onClose}
                          className="block border-b border-white/10 py-3 text-[15px] font-light transition-colors hover:text-white/70"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : results.length === 0 ? (
              <p className="mt-10 text-lg font-light text-white/70">
                По запросу «{query}» ничего не нашли. Попробуйте название модели, например KLF03.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-white/10" aria-live="polite">
                {results.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/catalog/${p.slug}` as Route}
                      onClick={onClose}
                      className="group flex items-center gap-5 py-4"
                    >
                      <span className="relative size-16 shrink-0 overflow-hidden rounded-md bg-white">
                        <Image
                          src={productImage(p.variants[0].sku)}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-contain p-1"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-lg font-light">{p.name}</span>
                        <span className="t-small block text-white/50">
                          {p.model} · {categoryById[p.category].name} · {formatPrice(p.price)}
                        </span>
                      </span>
                      <ArrowRight className="size-5 shrink-0 text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white" strokeWidth={1.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
