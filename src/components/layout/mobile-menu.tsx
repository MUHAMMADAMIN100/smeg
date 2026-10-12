"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronDown, Phone } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { NAV_GROUPS, NAV_LINKS, TOP_LINKS_LEFT, TOP_LINKS_RIGHT } from "@/lib/nav";
import { categoryById } from "@/data/categories";
import { contactLinks } from "@/lib/order";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const links = contactLinks();

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Закрыть меню"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/50"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="on-dark absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col overflow-y-auto bg-black text-white"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <Logo compact />
              <button
                type="button"
                onClick={onClose}
                aria-label="Закрыть меню"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 px-6 py-4" aria-label="Мобильное меню">
              <ul>
                {NAV_GROUPS.map((g) => {
                  const isOpen = expanded === g.id;
                  return (
                    <li key={g.id} className="border-b border-white/10">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : g.id)}
                        className="t-nav flex w-full cursor-pointer items-center justify-between py-4 text-left"
                      >
                        {g.label}
                        <ChevronDown className={cn("size-4 transition-transform duration-300", isOpen && "rotate-180")} strokeWidth={1.5} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {g.categories.map((id) => (
                              <li key={id}>
                                <Link
                                  href={`/catalog?category=${id}` as Route}
                                  onClick={onClose}
                                  className="block py-2.5 pl-4 text-[15px] font-light text-white/80 transition-colors hover:text-white"
                                >
                                  {categoryById[id].name}
                                </Link>
                              </li>
                            ))}
                            <li>
                              <Link href={g.href as Route} onClick={onClose} className="line-link mt-2 mb-4 pl-4 text-white">
                                Все товары
                              </Link>
                            </li>
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
                {NAV_LINKS.map((l) => (
                  <li key={l.href} className="border-b border-white/10">
                    <Link href={l.href as Route} onClick={onClose} className="t-nav block py-4">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="mt-6 space-y-3">
                {[...TOP_LINKS_LEFT, ...TOP_LINKS_RIGHT].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href as Route} onClick={onClose} className="t-small text-white/70 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-white/10 px-6 py-6">
              <p className="t-small text-white/60">{site.city} · {site.hours}</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center bg-white text-sm font-semibold text-black">
                  WhatsApp
                </a>
                <a href={links.telegram} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center border border-white/40 text-sm font-semibold">
                  Telegram
                </a>
              </div>
              <a href={links.phone} className="mt-4 flex items-center gap-2 text-sm text-white/80">
                <Phone className="size-4" strokeWidth={1.5} /> {site.phoneDisplay}
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
