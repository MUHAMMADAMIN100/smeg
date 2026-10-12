import Image from "next/image";
import Link from "next/link";
import { Truck, ShieldCheck, CreditCard } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/data/site";

const FACTS = [
  { value: "1948", label: "год основания, Гвасталла" },
  { value: "100+", label: "стран присутствия" },
  { value: "10", label: "фирменных цветов" },
];

const SERVICES = [
  { icon: Truck, title: "Доставка и установка", text: "По Истаравшану бесплатно, по Таджикистану за 1–3 дня." },
  { icon: ShieldCheck, title: "Официальная гарантия", text: "Заводская гарантия SMEG, оригинальные запчасти и сервис." },
  { icon: CreditCard, title: "Рассрочка", text: "Оформляем через партнёров за несколько минут при заказе." },
];

/** «Smeg in the world» со smeg.com, адаптировано под партнёра в Таджикистане. */
export function About() {
  return (
    <section id="about" className="scroll-mt-28" aria-labelledby="about-title">
      <div className="grid lg:grid-cols-2">
        <Reveal className="relative min-h-[360px] lg:min-h-[640px]">
          <Image
            src="/lifestyle/hero-coffee.jpg"
            alt="Техника SMEG в интерьере"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </Reveal>
        <div className="on-dark flex items-center bg-black px-6 py-16 text-white sm:px-12 lg:px-16 lg:py-24">
          <Reveal delay={0.1}>
            <p className="t-label text-white/50">О бренде</p>
            <h2 id="about-title" className="t-section mt-4">
              Smeg. Италия, с 1948 года
            </h2>
            <p className="mt-6 max-w-lg text-[15px] font-light leading-relaxed text-white/75 sm:text-base">
              Семейная компания из Эмилии-Романьи, где дизайн обсуждают так же серьёзно, как инженерию.
              Мы, {site.legalName.toLowerCase()}, привозим технику напрямую с завода, устанавливаем и
              даём официальную гарантию.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {FACTS.map((f) => (
                <div key={f.label}>
                  <dt className="sr-only">{f.label}</dt>
                  <dd className="text-3xl font-light sm:text-4xl">{f.value}</dd>
                  <dd className="t-small mt-1 text-white/55">{f.label}</dd>
                </div>
              ))}
            </dl>
            <Link href="/contacts" className="line-link mt-10 text-white">
              Приехать в шоурум
            </Link>
          </Reveal>
        </div>
      </div>

      <Container className="py-14 sm:py-16">
        <ul className="grid gap-8 md:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="flex gap-5 border-t border-line pt-6">
              <s.icon className="mt-0.5 size-6 shrink-0 text-ink" strokeWidth={1.25} aria-hidden />
              <div>
                <h3 className="text-lg font-light">{s.title}</h3>
                <p className="mt-2 text-[15px] font-light leading-relaxed text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
