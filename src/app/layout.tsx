import type { Metadata, Viewport } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { site } from "@/data/site";

const mulish = Mulish({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mulish",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "SMEG Tajikistan — итальянская техника в стиле 50-х",
    template: "%s — SMEG Tajikistan",
  },
  description:
    "Официальный партнёр SMEG в Таджикистане. Холодильники, плиты, печи, кофемашины, тостеры и чайники в фирменных цветах. Заказ в WhatsApp и Telegram.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "SMEG Tajikistan",
    title: "SMEG Tajikistan — итальянская техника в стиле 50-х",
    description:
      "Официальный партнёр SMEG в Таджикистане. Итальянская премиальная техника в фирменных цветах.",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={mulish.variable}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
