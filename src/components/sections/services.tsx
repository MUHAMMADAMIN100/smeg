import { Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Accordion } from "@/components/ui/accordion";
import { faq } from "@/data/faq";

const SERVICES = [
  {
    icon: Truck,
    title: "Доставка и установка",
    text: "По Истаравшану доставляем и подключаем бесплатно. По всему Таджикистану — за 1–3 дня, крупную технику заносим и устанавливаем.",
    tint: "#cfe6f0",
  },
  {
    icon: ShieldCheck,
    title: "Официальная гарантия",
    text: "Заводская гарантия SMEG, оригинальные запчасти и сервис. Техника поставляется напрямую, с сертификатами и документами.",
    tint: "#d9eadf",
  },
  {
    icon: CreditCard,
    title: "Рассрочка",
    text: "Оформим рассрочку через партнёров за несколько минут. Первый взнос и срок подберём под вас при заказе.",
    tint: "#f7ecd1",
  },
];

export function Services() {
  return (
    <section id="services" className="scroll-mt-20 py-20 sm:py-28" aria-labelledby="services-title">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                number="06"
                eyebrow="Сервис"
                title={<span id="services-title">Покупка без сюрпризов</span>}
                description="Привозим, подключаем, даём гарантию и остаёмся на связи после покупки."
              />
            </Reveal>
            <div className="mt-10 grid gap-4">
              {SERVICES.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08}>
                  <div className="flex gap-5 rounded-[24px] border border-line bg-surface p-5">
                    <span
                      className="flex size-12 shrink-0 items-center justify-center rounded-full text-ink"
                      style={{ backgroundColor: s.tint }}
                    >
                      <s.icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-fg">{s.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.1}>
              <p className="eyebrow mb-6">Частые вопросы</p>
              <Accordion items={faq} />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
