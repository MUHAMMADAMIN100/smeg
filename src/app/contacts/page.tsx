import type { Metadata } from "next";
import { Clock, MapPin, Phone, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/icons";
import { site } from "@/data/site";
import { faq } from "@/data/faq";
import { contactLinks } from "@/lib/order";

export const metadata: Metadata = {
  title: "Контакты",
  description: `Шоурум SMEG в Истаравшане: ${site.address}. ${site.hours}. Доставка по Таджикистану, официальная гарантия, рассрочка.`,
};

const SERVICES = [
  {
    icon: Truck,
    title: "Доставка и установка",
    text: "По Истаравшану доставляем и подключаем бесплатно. По всему Таджикистану — за 1–3 дня, крупную технику заносим и устанавливаем.",
  },
  {
    icon: ShieldCheck,
    title: "Официальная гарантия",
    text: "Заводская гарантия SMEG, оригинальные запчасти и сервис. Техника поставляется напрямую, с сертификатами и документами.",
  },
  {
    icon: CreditCard,
    title: "Рассрочка",
    text: "Оформим рассрочку через партнёров за несколько минут. Первый взнос и срок подберём под вас при заказе.",
  },
];

function mapEmbedUrl() {
  const { lat, lng } = site.map;
  const d = 0.02;
  const bbox = [lng - d, lat - d, lng + d, lat + d].map((n) => n.toFixed(5)).join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export default function ContactsPage() {
  const links = contactLinks();
  return (
    <div className="pb-24 pt-10 sm:pt-14">
      <Container>
        <Reveal>
          <p className="t-label text-muted">Контакты</p>
          <h1 className="t-display mt-3 text-[clamp(2.2rem,5vw,3.6rem)]">Приходите посмотреть вживую</h1>
          <p className="mt-5 max-w-xl text-[15px] font-light leading-relaxed text-muted sm:text-base">
            Шоурум в Истаравшане: вся палитра на полках, можно открыть, потрогать и сравнить цвета при дневном свете.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <Reveal delay={0.1} className="lg:col-span-5">
            <ul className="divide-y divide-line border-y border-line">
              <li className="flex gap-4 py-5">
                <MapPin className="mt-1 size-5 shrink-0" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="t-label text-muted">Адрес</p>
                  <p className="mt-1 text-lg font-light">{site.address}</p>
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <Clock className="mt-1 size-5 shrink-0" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="t-label text-muted">Часы работы</p>
                  <p className="mt-1 text-lg font-light">{site.hours}</p>
                </div>
              </li>
              <li className="flex gap-4 py-5">
                <Phone className="mt-1 size-5 shrink-0" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="t-label text-muted">Телефон</p>
                  <a href={links.phone} className="mt-1 block text-lg font-light transition-colors hover:text-muted">
                    {site.phoneDisplay}
                  </a>
                </div>
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={links.whatsapp} external icon={<WhatsAppIcon className="size-4" />} iconPosition="left">
                WhatsApp
              </Button>
              <Button href={links.telegram} external variant="outline" icon={<TelegramIcon className="size-4" />} iconPosition="left">
                Telegram
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-7">
            <iframe
              title={`Карта: ${site.address}`}
              src={mapEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[380px] w-full border border-line grayscale-[0.3] sm:h-[480px]"
            />
          </Reveal>
        </div>

        <section id="service" className="mt-24 scroll-mt-28" aria-labelledby="service-title">
          <Reveal>
            <h2 id="service-title" className="t-section">
              Сервис
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {SERVICES.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08} className="border-t border-line pt-6">
                <s.icon className="size-6" strokeWidth={1.25} aria-hidden />
                <h3 className="mt-4 text-lg font-light">{s.title}</h3>
                <p className="mt-2 text-[15px] font-light leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        <section className="mt-20" aria-labelledby="faq-title">
          <Reveal>
            <h2 id="faq-title" className="t-section">
              Частые вопросы
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-3xl">
            <Accordion items={faq} />
          </Reveal>
        </section>
      </Container>
    </div>
  );
}
