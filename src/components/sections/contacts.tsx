import { Clock, MapPin, Phone, MessageCircle, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";
import { contactLinks } from "@/lib/order";

function mapEmbedUrl() {
  const { lat, lng } = site.map;
  const d = 0.02;
  const bbox = [lng - d, lat - d, lng + d, lat + d].map((n) => n.toFixed(5)).join("%2C");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function Contacts() {
  const links = contactLinks();
  return (
    <section id="contacts" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="contacts-title">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                number="07"
                eyebrow="Контакты"
                title={<span id="contacts-title">Приходите посмотреть вживую</span>}
                description="Шоурум в Истаравшане: вся палитра на полках, можно открыть, потрогать и сравнить цвета при дневном свете."
              />
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <ul className="space-y-5 text-fg">
                <li className="flex gap-4">
                  <MapPin className="mt-1 size-5 shrink-0 text-smeg" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="eyebrow mb-1">Адрес</p>
                    <p className="text-lg">{site.address}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-1 size-5 shrink-0 text-smeg" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="eyebrow mb-1">Часы работы</p>
                    <p className="text-lg">{site.hours}</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <Phone className="mt-1 size-5 shrink-0 text-smeg" strokeWidth={1.75} aria-hidden />
                  <div>
                    <p className="eyebrow mb-1">Телефон</p>
                    <a href={links.phone} className="text-lg transition-colors hover:text-smeg">
                      {site.phoneDisplay}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button href={links.whatsapp} external variant="accent" icon={<MessageCircle className="size-4" strokeWidth={2} />} iconPosition="left">
                  WhatsApp
                </Button>
                <Button href={links.telegram} external variant="outline" icon={<Send className="size-4" strokeWidth={2} />} iconPosition="left">
                  Telegram
                </Button>
                <Button href={links.phone} variant="ghost" icon={<Phone className="size-4" strokeWidth={2} />} iconPosition="left">
                  Позвонить
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} scale className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-[36px] border border-line bg-surface p-2">
              <iframe
                title={`Карта: ${site.address}`}
                src={mapEmbedUrl()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[380px] w-full rounded-[28px] grayscale-[0.35] sepia-[0.15] dark:brightness-[0.85] dark:contrast-[1.1] sm:h-[480px]"
              />
              <div className="pointer-events-none absolute bottom-6 left-6 rounded-full bg-paper px-4 py-2 text-sm font-medium text-ink shadow-[0_12px_30px_-12px_rgba(21,19,15,0.4)]">
                {site.city} · шоурум SMEG
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
