"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ChevronDown, Menu, Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { NAV_GROUPS, NAV_LINKS, TOP_LINKS_LEFT, TOP_LINKS_RIGHT, type NavGroup } from "@/lib/nav";
import { categoryById } from "@/data/categories";
import { getCategoryCounts } from "@/lib/products";
import { cn } from "@/lib/utils";

type MenuId = NavGroup["id"] | null;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState<MenuId>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<number | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 80));

  // При переходе на другую страницу всё закрываем (паттерн «состояние из пропсов»).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenu(null);
    setSearchOpen(false);
    setDrawerOpen(false);
  }

  const openMenu = useCallback((id: MenuId) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMenu(id);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenu(null), 180);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const counts = getCategoryCounts();
  const activeGroup = NAV_GROUPS.find((g) => g.id === menu) ?? null;

  return (
    <>
      <header className="on-dark sticky top-0 z-50 bg-black text-white" onMouseLeave={scheduleClose}>
        {/* Верхняя строка: ссылки, логотип по центру */}
        <div
          className={cn(
            "hidden overflow-hidden transition-[height] duration-500 ease-out-expo lg:block",
            scrolled ? "h-0" : "h-[82px]",
          )}
        >
          <Container className="grid h-[82px] grid-cols-[1fr_auto_1fr] items-center">
            <ul className="flex gap-7">
              {TOP_LINKS_LEFT.map((l) => (
                <li key={l.label}>
                  <Link href={l.href as Route} className="t-small text-white/85 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Logo priority />
            <ul className="flex justify-end gap-7">
              {TOP_LINKS_RIGHT.map((l) => (
                <li key={l.label}>
                  <Link href={l.href as Route} className="t-small text-white/85 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </div>

        {/* Основной ряд */}
        <Container className="relative flex h-16 items-center justify-between lg:h-[60px]">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Открыть меню"
            className="flex size-11 -ml-2 cursor-pointer items-center justify-center lg:hidden"
          >
            <Menu className="size-6" strokeWidth={1.5} />
          </button>

          <nav className="hidden h-full items-center gap-9 lg:flex" aria-label="Основное меню">
            {NAV_GROUPS.map((g) => {
              const isOpen = menu === g.id;
              return (
                <div key={g.id} className="flex h-full items-center" onMouseEnter={() => openMenu(g.id)}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`mega-${g.id}`}
                    onClick={() => (isOpen ? setMenu(null) : openMenu(g.id))}
                    className={cn(
                      "t-nav flex cursor-pointer items-center gap-1.5 border-b py-1 transition-colors duration-300",
                      isOpen ? "border-white" : "border-transparent hover:border-white/60",
                    )}
                  >
                    {g.label}
                    <ChevronDown className={cn("size-3.5 transition-transform duration-300", isOpen && "rotate-180")} strokeWidth={1.75} />
                  </button>
                </div>
              );
            })}
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href as Route}
                onMouseEnter={scheduleClose}
                className="t-nav border-b border-transparent py-1 transition-colors duration-300 hover:border-white/60"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Логотип: по центру на телефоне всегда, на десктопе только когда верхняя строка спрятана */}
          <Logo compact className="absolute left-1/2 -translate-x-1/2 lg:hidden" priority />
          <Logo
            compact
            className={cn(
              "absolute left-1/2 hidden -translate-x-1/2 transition-opacity duration-500 lg:flex",
              scrolled ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          />

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
              className="flex size-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-70"
            >
              <Search className="size-[22px]" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Открыть меню"
              className="hidden size-11 cursor-pointer items-center justify-center transition-opacity hover:opacity-70 lg:flex"
            >
              <Menu className="size-6" strokeWidth={1.5} />
            </button>
          </div>
        </Container>

        {/* Мега-меню */}
        <AnimatePresence>
          {activeGroup && (
            <motion.div
              id={`mega-${activeGroup.id}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => openMenu(activeGroup.id)}
              onMouseLeave={scheduleClose}
              className="absolute inset-x-0 top-full hidden border-t border-white/10 bg-black shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] lg:block"
            >
              <Container className="grid grid-cols-12 gap-10 py-10">
                <div className="col-span-7">
                  <p className="t-label text-white/50">{activeGroup.label}</p>
                  <ul className="mt-4 grid grid-cols-2 gap-x-10">
                    {activeGroup.categories.map((id) => (
                      <li key={id}>
                        <Link
                          href={`/catalog?category=${id}` as Route}
                          className="group flex items-center justify-between border-b border-white/10 py-3.5 text-[17px] font-light transition-colors hover:text-white/70"
                        >
                          {categoryById[id].name}
                          <span className="t-small text-white/40 transition-colors group-hover:text-white/70">{counts[id]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={activeGroup.href as Route} className="line-link mt-8 text-white">
                    Смотреть все товары
                  </Link>
                </div>
                <div className="col-span-5 flex items-center gap-8">
                  <div className="relative aspect-square w-52 shrink-0">
                    <Image
                      src={`/cutouts/${activeGroup.coverSku.toLowerCase()}.webp`}
                      alt=""
                      fill
                      sizes="208px"
                      className="object-contain"
                    />
                  </div>
                  <p className="text-[15px] font-light leading-relaxed text-white/70">{activeGroup.caption}</p>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <MobileMenu open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
