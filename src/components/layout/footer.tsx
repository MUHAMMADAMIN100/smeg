import Link from "next/link";
import type { Route } from "next";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/layout/logo";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { categories } from "@/data/categories";
import { site } from "@/data/site";
import { contactLinks } from "@/lib/order";

const COMPANY: { label: string; href: string }[] = [
  { label: "О бренде", href: "/#about" },
  { label: "Новинки", href: "/#new" },
  { label: "Цвета", href: "/colors" },
  { label: "Линии дизайна", href: "/#lines" },
];

const SERVICE: { label: string; href: string }[] = [
  { label: "Доставка и установка", href: "/contacts#service" },
  { label: "Гарантия", href: "/contacts#service" },
  { label: "Рассрочка", href: "/contacts#service" },
  { label: "Контакты", href: "/contacts" },
];

export function Footer() {
  const links = contactLinks();
  return (
    <footer className="on-dark bg-black text-white">
      <Container className="py-14 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-sm text-[15px] font-light leading-relaxed text-white/70">
              {site.legalName}. Итальянская техника в стиле 50-х, Portofino и Victoria: холодильники,
              плиты, кофемашины и малая техника.
            </p>
            <div className="mt-6 flex gap-3">
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex size-11 items-center justify-center rounded-full border border-white/25 transition-colors hover:border-white">
                <WhatsAppIcon className="size-5" />
              </a>
              <a href={links.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="flex size-11 items-center justify-center rounded-full border border-white/25 transition-colors hover:border-white">
                <TelegramIcon className="size-5" />
              </a>
              <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex size-11 items-center justify-center rounded-full border border-white/25 transition-colors hover:border-white">
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="t-label text-white/50">Техника</p>
              <ul className="mt-5 space-y-2.5">
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link href={`/catalog?category=${c.id}` as Route} className="text-[15px] font-light text-white/80 transition-colors hover:text-white">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label text-white/50">Компания</p>
              <ul className="mt-5 space-y-2.5">
                {COMPANY.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href as Route} className="text-[15px] font-light text-white/80 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="t-label mt-8 text-white/50">Сервис</p>
              <ul className="mt-5 space-y-2.5">
                {SERVICE.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href as Route} className="text-[15px] font-light text-white/80 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label text-white/50">Контакты</p>
              <ul className="mt-5 space-y-3 text-[15px] font-light text-white/80">
                <li>{site.address}</li>
                <li>{site.hours}</li>
                <li>
                  <a href={links.phone} className="transition-colors hover:text-white">
                    {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                    @{site.instagram}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="t-small text-white/50">© {site.copyrightYear} {site.name}. {site.legalName}.</p>
          <p className="t-small text-white/50">SMEG — зарегистрированный товарный знак Smeg S.p.A., Гвасталла, Италия.</p>
        </div>
      </Container>
    </footer>
  );
}
