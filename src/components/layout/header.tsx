"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAV_LINKS } from "@/lib/nav";
import { contactLinks } from "@/lib/order";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const links = contactLinks();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Закрываем меню при переходе на другую страницу (паттерн «состояние из пропсов» без эффекта).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Блокируем прокрутку страницы, пока открыто мобильное меню.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || open
            ? "border-b border-line bg-bg/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <Container className="flex h-[72px] items-center justify-between gap-6">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
            {NAV_LINKS.map((link) => {
              const active = link.href === "/catalog" && pathname.startsWith("/catalog");
              return (
                <Link
                  key={link.href}
                  href={link.href as Route}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[15px] font-medium text-fg-muted transition-colors duration-300 hover:text-fg",
                    active && "text-fg",
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute inset-x-4 -bottom-0.5 h-px bg-smeg" aria-hidden />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Button
              href={links.whatsapp}
              external
              variant="accent"
              size="sm"
              className="hidden sm:inline-flex"
              icon={<MessageCircle className="size-4" strokeWidth={2} />}
              iconPosition="left"
            >
              Написать
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              className="relative flex size-11 cursor-pointer items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-fg lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-[1.5px] w-5 bg-current transition-transform duration-400 ease-out-expo",
                  open ? "rotate-45" : "-translate-y-[3.5px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-[1.5px] w-5 bg-current transition-transform duration-400 ease-out-expo",
                  open ? "-rotate-45" : "translate-y-[3.5px]",
                )}
              />
            </button>
          </div>
        </Container>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg pt-[72px] lg:hidden"
          >
            <Container className="flex h-full flex-col justify-between py-8">
              <nav className="flex flex-col" aria-label="Мобильное меню">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-line"
                  >
                    <Link
                      href={link.href as Route}
                      onClick={() => setOpen(false)}
                      className="font-display flex items-center justify-between py-5 text-[2rem] leading-none text-fg"
                    >
                      {link.label}
                      <ArrowUpRight className="size-6 text-fg-faint" strokeWidth={1.5} />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <p className="eyebrow">{site.city} · {site.hoursShort} ежедневно</p>
                <div className="flex flex-wrap gap-3">
                  <Button href={links.whatsapp} external variant="accent" className="flex-1">
                    WhatsApp
                  </Button>
                  <Button href={links.telegram} external variant="outline" className="flex-1">
                    Telegram
                  </Button>
                </div>
                <a href={links.phone} className="block text-lg font-medium text-fg">
                  {site.phoneDisplay}
                </a>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
