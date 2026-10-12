import Link from "next/link";
import type { Route } from "next";
import { MapPin, Clock, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { NAV_LINKS } from "@/lib/nav";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import { contactLinks } from "@/lib/order";

export function Footer() {
  const links = contactLinks();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-elevated">
      <Container className="pt-16 pb-10 sm:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo large />
            <p className="mt-6 max-w-sm text-fg-muted leading-relaxed">
              {site.legalName}. Итальянская техника в стиле 50-х: холодильники, плиты, кофемашины
              и малая техника в фирменных пастельных цветах.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-full bg-fg px-5 text-sm font-medium text-bg transition-colors hover:bg-smeg hover:text-white"
              >
                WhatsApp
              </a>
              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-sm font-medium text-fg transition-colors hover:border-fg"
              >
                Telegram
              </a>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram SMEG Tajikistan"
                className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-fg"
              >
                <InstagramIcon className="size-[18px]" />
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="eyebrow mb-5">Навигация</p>
              <ul className="space-y-3">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href as Route}
                      className="text-fg-muted transition-colors hover:text-fg"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Категории</p>
              <ul className="space-y-3">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/catalog?category=${c.id}` as Route}
                      className="text-fg-muted transition-colors hover:text-fg"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5">Контакты</p>
              <ul className="space-y-4 text-fg-muted">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-[18px] shrink-0 text-fg-faint" strokeWidth={1.75} />
                  <span>{site.address}</span>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 size-[18px] shrink-0 text-fg-faint" strokeWidth={1.75} />
                  <span>{site.hours}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-[18px] shrink-0 text-fg-faint" strokeWidth={1.75} />
                  <a href={links.phone} className="transition-colors hover:text-fg">
                    {site.phoneDisplay}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rule mt-16 flex flex-col gap-3 pt-6 text-sm text-fg-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.copyrightYear} {site.name}. {site.legalName}.</p>
          <p>SMEG — зарегистрированный товарный знак Smeg S.p.A., Гвасталла, Италия.</p>
        </div>
      </Container>

      {/* Гигантская надпись в подвале */}
      <div
        className="pointer-events-none select-none overflow-hidden text-center leading-none"
        aria-hidden
      >
        <span className="block translate-y-[22%] font-sans text-[clamp(6rem,24vw,22rem)] font-extrabold lowercase tracking-[-0.08em] text-fg/[0.06] dark:text-fg/[0.05]">
          smeg
        </span>
      </div>
    </footer>
  );
}
